#!/usr/bin/env ruby
require 'rubygems'
require 'evernote'
require 'yaml'

user_store_url = "https://sandbox.evernote.com/edam/user"

config = YAML.load_file "evernote.yml"

# note, you could also read in your consumer key information from a YML file

user_store = Evernote::UserStore.new(user_store_url, config)

auth_result = user_store.authenticate
user = auth_result.user
auth_token = auth_result.authenticationToken
puts "Authentication was successful for #{user.username}"
puts "Authentication token = #{auth_token}"


note_store_url = "http://sandbox.evernote.com/edam/note/#{user.shardId}"
note_store = Evernote::NoteStore.new(note_store_url)

notebooks = note_store.listNotebooks(auth_token)
puts "Found #{notebooks.size} notebooks:"
default_notebook = notebooks[0]
notebooks.each { |notebook| puts "  * #{notebook.name}"}


puts default_notebook.guid;

class NoteFilter
   include ::Thrift::Struct, ::Thrift::Struct_Union
   ORDER = 1
   ASCENDING = 2
   WORDS = 3
   NOTEBOOKGUID = 4
   TAGGUIDS = 5
   TIMEZONE = 6
   INACTIVE = 7

   FIELDS = {
     ORDER => {:type => ::Thrift::Types::I32, :name => 'order', :optional => true},
     ASCENDING => {:type => ::Thrift::Types::BOOL, :name => 'ascending', :optional => true},
     WORDS => {:type => ::Thrift::Types::STRING, :name => 'words', :optional => true},
     NOTEBOOKGUID => {:type => ::Thrift::Types::STRING, :name => 'notebookGuid', :optional => true},
     TAGGUIDS => {:type => ::Thrift::Types::LIST, :name => 'tagGuids', :element => {:type => ::Thrift::Types::STRING}, :optional => true},
     TIMEZONE => {:type => ::Thrift::Types::STRING, :name => 'timeZone', :optional => true},
     INACTIVE => {:type => ::Thrift::Types::BOOL, :name => 'inactive', :optional => true}
   }

   def struct_fields; FIELDS; end

   def validate
   end

   ::Thrift::Struct.generate_accessors self
 end

filter = NoteFilter.new;
filter.notebookGuid = default_notebook.guid;


notes = note_store.findNotes(auth_token, filter, 0, 100)

notes.notes.each { |note|
  
 content = note_store.getNote(auth_token, note.guid, true, false, false, false)
 
 puts content.content
 
}
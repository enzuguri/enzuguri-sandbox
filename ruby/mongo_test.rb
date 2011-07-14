#!/usr/bin/env ruby
require "rubygems"
require 'mongo'

connection = Mongo::Connection.new "localhost"

puts connection.database_names

db = connection.db "mydb"

thing = {"make" => "alex", "other" => rand}

cars = db.collection "things"

#cars.insert thing

cars.find().each { |item|
  
  puts "this is the item make: %s and the other property %s" % [item['make'], item['other']]
}

def method_missing symb, *args
  puts "out put %s and args: %s" % [symb, args]
end



self.jerry 10

self.anni 12
#!/usr/bin/env ruby
require 'yaml'



class Reader
  def say what, who, where
    p "hello " + what + " : " + who
  end
  
end




config = YAML.load_file 'config.yml'
p config['user']

r = Reader.new;
r.say "spanner", "gows", "home";

file = File.new "empt.txt", "w"
file.write "You've gotta be kidding me!"
file.close


file = File.open "empt.txt" 

file.each { |line |
  puts line;
}
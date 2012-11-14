package music.theory;
class Signature {
    public function new(numBeats:Int, value:NoteValue) {
        numberOfBeats = numBeats;
        noteValue = value;
    }

    public var numberOfBeats:Int;
    public var noteValue:NoteValue;

    public function clone():Signature
    {
        return new Signature(numberOfBeats, noteValue);
    }


    public static var FourFour:Signature = new Signature(4, NoteValue.Quarter);
}

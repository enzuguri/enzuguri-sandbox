package music.theory;
class Pitch {

    public var octave(get_octave, set_octave):Int;

    public var tone(get_tone, null):Int;

    function get_tone():Int
    {
        return _tone;
    }

    var _tone:Int;

    function get_octave():Int
    {
        return Math.floor(_tone/12);
    }

    function set_octave(value:Int):Int
    {

        return value;
    }


    public function new(tone:Int) {
        _tone = tone;
    }

    public var name(get_name, set_name):String;


    public function get_name():String
    {
        var abs = _tone % 12;

        var note = Type.createEnumIndex(NoteName, abs);

        return Type.enumConstructor(note);
    }

    function set_name(value:String):String
    {
        return value;
    }






}

package music.theory;
enum Mode {
    Ionian;
    Dorian;
    Phrygian;
    Lydian;
    Mixolydian;
    Aeolian;
    Locrian;
}

class ModeUtil
{
    private static var IONIAN_SEQUNECE:Array<Int> = [2,2,1,2,2,2,1];

    public static function fromSequence(sequence:Array<Int>):Mode
    {



        return Mode.Ionian;
    }

    public static function toSequence(mode:Mode):Array<Int>
    {
        var index = Type.enumIndex(mode);

        return reorderSequence(IONIAN_SEQUNECE, index);
    }

    private static function reorderSequence(sequence:Array<Int>, offset:Int):Array<Int>
    {
        var back = sequence.slice(0, offset);
        var front = sequence.slice(offset, sequence.length);

        return front.concat(back);
    }
}
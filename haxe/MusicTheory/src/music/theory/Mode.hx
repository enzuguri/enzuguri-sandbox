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
        var compare = IONIAN_SEQUNECE;

        for(offset in 0...8)
        {
            compare = reorderSequence(IONIAN_SEQUNECE, offset);
            if(sequenceMatches(compare, sequence))
                return Type.createEnumIndex(Mode, offset);
        }

        return Mode.Ionian;
    }


    private static function sequenceMatches(a:Array<Int>, b:Array<Int>):Bool
    {
        var len = a.length;
        for(i in 0...len)
        {
            if(a[i] != b[i])
                return false;
        }

        return true;
    }

    public static function toSequence(mode:Mode):Array<Int>
    {
        var index = Type.enumIndex(mode);
        return reorderSequence(IONIAN_SEQUNECE, index);
    }

    public static function reorderSequence(sequence:Array<Int>, offset:Int):Array<Int>
    {
        var back = sequence.slice(0, offset);
        var front = sequence.slice(offset, sequence.length);

        return front.concat(back);
    }
}
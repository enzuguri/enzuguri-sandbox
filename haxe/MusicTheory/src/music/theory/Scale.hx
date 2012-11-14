package music.theory;
import music.theory.Mode;
class Scale {
    public function new(toneOrder:Array<Int>, ?root:Pitch = null) {
        _toneOrder = toneOrder;
        _root = root;
    }

    var _toneOrder:Array<Int>;

    var _root:Pitch;

    public var root(get_root, set_root):Pitch;

    function get_root():Pitch{ return _root; }

    function set_root(value:Pitch):Pitch{
        _root = value;
        return value;
    }


    public function asMode(mode:Mode):Scale
    {
        var index = Type.enumIndex(mode);
        var newOrder = ModeUtil.reorderSequence(_toneOrder, index);
        return new Scale(newOrder, pitchAtPosition(index));

    }

    public var mode(get_mode, set_mode):Mode;

    function get_mode():Mode
    {
        return ModeUtil.fromSequence(_toneOrder);
    }

    function set_mode(value:Mode):Mode
    {
        _toneOrder = ModeUtil.toSequence(value);
        return value;
    }


    public function pitchAtPosition(pos:Int):Pitch
    {
        var tone = _root.tone;

        for(i in 0...pos)
        {
            tone += _toneOrder[i];
        }

        return new Pitch(tone);
    }


    public function iterator ():Iterator<Pitch> {
        return new ScaleIterator(this);
    }

    public var length(get_length, null):Int;


    function get_length():Int
    {
        return _toneOrder.length;
    }



}

class ScaleIterator
{
    var _scale:Scale;
    var _position:Int;

    public function new(scale:Scale){
        _scale = scale;
        _position = 0;
    }

    public function hasNext(): Bool {
        return _position < _scale.length;
    }
    public function next(): Pitch {
        var pitch = _scale.pitchAtPosition(_position);
        _position++;
        return pitch;
    }
}

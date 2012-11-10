package ;
import music.theory.Mode;
import music.theory.Scale;
import music.theory.Pitch;
class Tester {
    public function new() {

        var root = new Pitch(0);
        var base = ModeUtil.toSequence(Mode.Ionian);

        var scale = new Scale(base, root);

        for(p in scale)
        {
            trace(p.name);
        }

        var mode = scale.asMode(Mode.Aeolian);

        trace("");

        for(p in mode)
        {
            trace(p.name);
        }


    }


    public static function main(){
        new Tester();
    }
}

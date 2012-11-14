package ;
import music.theory.Signature;
import music.theory.Meter;
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

        trace(scale.mode);

        var mode = scale.asMode(Mode.Aeolian);

        trace(mode.mode);

        for(p in mode)
        {
            trace(p.name);
        }

        var meter = new Meter(Signature.FourFour.clone());
        var measure = meter.createMeasure();
    }


    public static function main(){
        new Tester();
    }
}

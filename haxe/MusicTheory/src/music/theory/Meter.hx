package music.theory;
class Meter {
    public function new(sig:Signature) {
        _signature = sig;
        _measures = [];
    }

    private var _signature:Signature;
    private var _measures:Array<Measure>;

    public function createMeasure():Measure
    {
        var m = new Measure(this);
        _measures.push(m);
        return m;
    }
}

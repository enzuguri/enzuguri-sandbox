package music.theory;
class Measure {
    public function new(meter:Meter) {
        _meter = meter;
    }

    private var _beats:Array<Beat>;

    private var _meter:Meter;
}

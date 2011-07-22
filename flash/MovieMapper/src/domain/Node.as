package domain
{
	import flash.display.Sprite;
	
	public class Node
	{
		private var _data:Vector.<Node>;
		
		protected var _label:String;
		
		public function Node(label:String)
		{
			_label = label;
		}
		
		
		
		
		public function setData(data:Vector.<Node>):void
		{
			_data = data;
		}
		
		
		
		
		public function toLabel():String
		{
			return _label;
		}
		
		
		public function hasData():Boolean
		{
			return _data != null;
		}
		
		public function getData():Vector.<Node>
		{
			return _data;
		}
	}
}
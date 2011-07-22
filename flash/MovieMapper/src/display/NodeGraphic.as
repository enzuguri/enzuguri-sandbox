package display
{
	import com.greensock.TweenLite;
	import com.greensock.TweenMax;
	import com.greensock.easing.Bounce;
	import com.greensock.easing.Expo;
	
	import domain.Node;
	
	import flash.display.Graphics;
	import flash.display.Sprite;
	import flash.text.AntiAliasType;
	import flash.text.TextField;
	import flash.text.TextFieldAutoSize;
	import flash.text.TextFormat;
	
	public class NodeGraphic extends Sprite
	{
		protected var color:uint;
		
		protected var isOpen:Boolean;
		
		
		protected var children:Vector.<NodeGraphic>;
		protected var node:Node;
		protected var radius:Number;
		private var tf:TextField;
		
		public function NodeGraphic()
		{
			super();
			
			startAngle = 0;
			radius = 120;
			alpha = 0;
			isOpen = false;
			buttonMode = true;
			children = new Vector.<NodeGraphic>();
			
			tf = new TextField();
			addChild(tf);
			tf.autoSize = TextFieldAutoSize.CENTER;
			tf.defaultTextFormat = new TextFormat("Arial");
			tf.selectable = false;
			tf.antiAliasType = AntiAliasType.ADVANCED;
			tf.mouseEnabled = false;
		}
		
		public var startAngle:Number;
		
		public function draw():void
		{
			var g:Graphics = this.graphics;
			
			g.beginFill(color);
			g.drawCircle(0,0,30);
			g.endFill();
		}
		
		public function setData(type:Node):void
		{
			node = type;
			
			invalidate();
			draw();
		}
		
		protected function invalidate():void
		{
			// TODO Auto Generated method stub
			tf.text = node.toLabel().toUpperCase();
			tf.x = -(tf.width >> 1);
			tf.y = -(tf.height >> 1);
		}
		
		public function close(x:Number, y:Number, viz:Boolean = false):void
		{
			isOpen = false;
			var len:int = children.length;
			for(var i:int = 0; i < len; i++)
			{
				children[i].close(x, y);
			}
			
			
			var g:Graphics = this.graphics;
			g.clear();
			draw();
			
			TweenMax.to(this, 0.4, {x:x, y:y, ease:Bounce.easeOut, autoAlpha: viz ? 1 : 0});
		}
		
		public function getIsOpen():Boolean
		{
			return isOpen;
		}
		
		public function open(nx:Number, ny:Number, recur:Boolean = false):void
		{
			
			
			if(recur)
			{
				recursiveOpen(nx, ny);
				isOpen = true;
			}
			
			
			TweenMax.to(this, 0.6, {x:nx, y:ny, ease:Expo.easeOut, autoAlpha:1});
		}
		
		private function recursiveOpen(nx:Number, ny:Number):void
		{
			var len:int = children.length;
			
			var chunksSize:Number = (Math.PI * 2) / (len + 1);
			
			var ax:Number;
			var ay:Number;
			
			var ang:Number;
			
			var randRad:Number = randOmRadius();
			
			
			var g:Graphics = this.graphics;
			g.clear();
			g.lineStyle(2, color);
			draw();
			
			for(var i:int = 0; i < len; i++)
			{
				ang = (i+1) * chunksSize;
				ang += startAngle + Math.PI;
				randRad = randOmRadius();
				ax = (Math.cos(ang) * randRad);
				ay = (Math.sin(ang) * randRad);
				children[i].startAngle = ang;
				children[i].x = nx;
				children[i].y = ny;
				children[i].open(nx + ax, ny + ay);
				
				
				g.moveTo(0, 0);
				g.lineTo(ax, ay);
				
				
			}
		}
		
		private function randOmRadius():Number
		{
			return -30 + (Math.random() * 60) + radius;
		}
		
		public function hasData():Boolean
		{
			return node.hasData();
		}
		
		public function getData():Node
		{
			return node;
		}
		
		public function addNode(g:NodeGraphic):void
		{
			children.push(g);
			
		}
		
		public function fade(value:Number):void
		{
			var len:int = children.length;
			
			for(var i:int = 0; i< len; i++)
			{
				children[i].fade(value);
			}
			
			
			TweenLite.to(this, 0.3, {alpha:value, ease:Expo.easeOut});
			
			
		}
	}
}
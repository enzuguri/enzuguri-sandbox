package
{
	import com.greensock.TweenLite;
	
	import display.NodeGraphic;
	import display.NodeGraphicBuilder;
	
	import domain.ActorGroupNode;
	import domain.ActorNode;
	import domain.DirectorNode;
	import domain.FilmNode;
	import domain.Node;
	
	import flash.display.Graphics;
	import flash.display.Sprite;
	import flash.display.StageAlign;
	import flash.display.StageScaleMode;
	import flash.events.MouseEvent;
	import flash.geom.Point;
	
	[SWF(frameRate="35", width="1024", height="768")]
	public class Main extends Sprite
	{
		private var startNode:NodeGraphic;
		private var builder:NodeGraphicBuilder;
		
		
		private var nodeTrail:Vector.<NodeGraphic>;
		private var container:Sprite;
		private var sw:int;
		private var sh:int;
		
		public function Main()
		{
			
			setupStage();
			
			setup();
			
		}
		
		private function setup():void
		{
			nodeTrail = new Vector.<NodeGraphic>();
			
			var node:Node = new FilmNode("Start Node");
			
			builder = new NodeGraphicBuilder();
			container = new Sprite();
			container.mouseEnabled = false;
			addChild(container);
			
			startNode = addNewNode(node, new Point(300, 200));
			
			startNode.visible = true;
			startNode.alpha = 1;
			
			container.addEventListener(MouseEvent.CLICK, mouseClicked);
			
			sw = stage.stageWidth;
			sh = stage.stageHeight;
		}
		
		protected function mouseClicked(e:MouseEvent):void
		{
			var node:NodeGraphic = e.target as NodeGraphic;
			
			if(node)
			{
				processNode(node);
			}
			
		}
		
		private function processNode(node:NodeGraphic):void
		{
			
			if(node.getIsOpen())
			{
				node.close(node.x, node.y, true);
				
				
				
				var index:int = nodeTrail.indexOf(node);
				var len:int = nodeTrail.length;
				nodeTrail.splice(index, len - index);
				
				fadePreviousNode(1);
			}
			else
			{
				if(!node.hasData())
				{
					populateNode(node.getData());
					createNodeChildren(node);
				}
				
				fadePreviousNode(0.4);
				
				node.open(node.x, node.y, true);
				nodeTrail.push(node);
				
			}
			
			
			var p:Point = node.localToGlobal(new Point());
			p.x = (sw - p.x);
			p.y = (sh - p.y);
			
			//TweenLite.to(container, 0.4, {x:p.x, y:p.y});
			
			updateNodeTrail();
		}
		
		private function fadePreviousPreviousNode(value:int):void
		{
			try
			{
				var node:NodeGraphic = nodeTrail[nodeTrail.length-2];
				node.fade(value);
			}
			catch(ex:RangeError)
			{
				
			}
		}
		
		private function fadePreviousNode(value:Number):void
		{
			try
			{
				var node:NodeGraphic = nodeTrail[nodeTrail.length-1];
				node.fade(value);
			}
			catch(ex:RangeError)
			{
				
			}
			
		}
		
		private function updateNodeTrail():void
		{
			// TODO Auto Generated method stub
			var g:Graphics = container.graphics;
			
			g.clear();
			
			var len:int = nodeTrail.length;
			
			g.moveTo(startNode.x, startNode.y);
			g.lineStyle(5, 0x00FF00);
			
			for(var i:int = 0; i < len; i++)
			{
				g.lineTo(nodeTrail[i].x, nodeTrail[i].y);
			}
			
			
		}
		
		private function populateNode(node:Node):void
		{
			switch(node['constructor'])
			{
				case FilmNode:
					populateFilmNode(node);	
					break;
				
				case ActorGroupNode:
					populateActorGroupNode(node);
					break;
				
				case ActorNode:
					populateActorNode(node);
					break;
				
				case DirectorNode:
					populateDirectorNode(node);
					break;
			}
			
		}
		
			
		
		
		private function createNodeChildren(node:NodeGraphic):void
		{
			var pack:Vector.<Node> = node.getData().getData();
			
			var len:int = pack.length;
			var p:Point = new Point(node.x, node.y);
			
			for(var i:int = 0; i<len; i++)
			{
				node.addNode(addNewNode(pack[i], p));
			}
			
		}
		
		private function addNewNode(node:Node, at:Point):NodeGraphic
		{
			var g:NodeGraphic = builder.createNode(node);
			g.x = at.x;
			g.y = at.y;
			g.visible = false;
			container.addChild(g);
			g.setData(node);
			
			return g;
		}
		
		private function setupStage():void
		{
			// TODO Auto Generated method stub
			stage.scaleMode = StageScaleMode.NO_SCALE;
			stage.align = StageAlign.TOP_LEFT;
		}
		
		
		public function populateFilmNode(node:Node):void
		{
			var nodes:Vector.<Node> = generateFilms();
			nodes.push(new ActorGroupNode());
			nodes.push(new DirectorNode("Director"));
			
			node.setData(nodes);	
		}
		
		
		private function populateDirectorNode(node:Node):void
		{
			var nodes:Vector.<Node> = generateFilms();
			
			node.setData(nodes.concat(generateActors()));
		}	
		
		private function populateActorNode(node:Node):void
		{
			var nodes:Vector.<Node> = generateFilms();
			
			node.setData(nodes.concat(generateDirectors()));
			
		}
		
		private function populateActorGroupNode(node:Node):void
		{
			node.setData(generateActors());
		}
		
		
		public function generateFilms():Vector.<Node>
		{
			var list:Vector.<Node> = new Vector.<Node>();
			
			list.push(new FilmNode("Film A"));
			list.push(new FilmNode("Film B"));
			list.push(new FilmNode("Film C"));
			list.push(new FilmNode("Film D"));
			
			return list;
		}
			
		
		public function generateDirectors():Vector.<Node>
		{
			var list:Vector.<Node> = new Vector.<Node>();
			
			list.push(new DirectorNode("Director A"));
			list.push(new DirectorNode("Director B"));
			list.push(new DirectorNode("Director C"));
			
			return list;
		}
		
		
		public function generateActors():Vector.<Node>
		{
			var list:Vector.<Node> = new Vector.<Node>();
			
			list.push(new ActorNode("Actor A"));
			list.push(new ActorNode("Actor B"));
			list.push(new ActorNode("Actor C"));
			list.push(new ActorNode("Actor D"));
			list.push(new ActorNode("Actor E"));
			
			return list;
		}
			
		
	}
}
package display
{
	import domain.ActorGroupNode;
	import domain.ActorNode;
	import domain.DirectorNode;
	import domain.FilmNode;
	import domain.Node;
	
	import flash.display.DisplayObject;

	public class NodeGraphicBuilder
	{
		public function NodeGraphicBuilder()
		{
		}
		
		
		public function createNode(type:Node):NodeGraphic
		{
			var graphic:NodeGraphic;
			
			switch(type['constructor'])
			{
				case FilmNode:
					
					graphic = new FilmGraphic();
					
					break;
				
				case ActorNode:
					
					graphic = new ActorGraphic();
					
					break;
				
				case ActorGroupNode:
					
					graphic = new ActorGroupGraphic();
					
					break;
				
				case DirectorNode:
					graphic = new DirectorGraphic();
					break;
			}
			
			
			graphic.setData(type);
			
			return graphic;
		}
	}
}
processContainer = function(container,componentInfo){
	var options = componentInfo.options;
	var components = componentInfo.components;
	var feedConfig = null;
	var floatElements = null;
	var mainElement = $("<div></div>").addClass("component-container"); 

	$(mainElement).uniqueId();
	
	if(options){
		var title = options.title;
		var titleHorizontalPosition = options.titleHorizontalPosition;
		var layoutRender = options.layoutRender;
		feedConfig = options.paginationComponent;
		floatElements = options.floatElements;

		if(title){
			
			var headerElement = $("<div></div>").addClass("component-container-header");
			$(headerElement).uniqueId();
			
			var titleElement = $("<h1></h1>").text(title).addClass("component-container-title");
			$(titleElement).uniqueId();

			$(headerElement).append(titleElement);
			$(mainElement).append(headerElement);

			if(titleHorizontalPosition){
				if(titleHorizontalPosition=="center"){
					$(headerElement).addClass("text-center");	
				}				
			}
		}
		if(layoutRender==true){
			$(mainElement).addClass("region-render");
		}
	}

	var bodyElement = $("<div></div>").addClass("component-container-body");
	$(bodyElement).uniqueId();
	
	$(mainElement).append(bodyElement);

	if(components){
		if(floatElements){
			$(bodyElement).addClass("component-container-float");
			var clearElement = $("<div></div>").addClass("component-container-clear");
			$(mainElement).append(clearElement);
			$(components).each(function(index,componentInfo){
				processComponent(bodyElement,componentInfo);
			});
		}else{
			processComponents(bodyElement,componentInfo.components);	
		}	
	}

	if(feedConfig){
		processComponent(bodyElement,feedConfig);
	}

	return mainElement;
}
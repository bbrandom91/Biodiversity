//Rather than hard coding initial currentSample, we could get first element of nameList.
//This would prevent it from giving an error if sample BB_940 were removed.
//For now let's take the easier, less general route.
currentSample = 'BB_940';
buildDropdown();
buildMetadata(currentSample);
buildPieChart(currentSample);
buildBubbleChart(currentSample);




function buildDropdown(){
	url = 'names';
	//Why are we using Plotly to handle the requests?

	Plotly.d3.json(url, function(error, response) {

		var nameList = response[0]["sample names"];
		nameListLength = nameList.length;
		for (i = 0; i < nameListLength ; i++){
			currentName = nameList[i];
			var dropdown = document.getElementById("selDataset");
			option = document.createElement("option");
			option.text = currentName;
			dropdown.add(option);

		};
	 });
};

function buildMetadata(sample){
	url = 'metadata/' + sample; 
	Plotly.d3.json(url, function(error, response){
		var metadata = response[0];
		//This method of updating is inefficient
		var metadataTag = document.getElementById("metadata table");
		metadataTag.innerHTML = '';
		var panelHead = document.createElement('div');
		panelHead.className = "panel-heading";
		panelHead.innerHTML = "Sample Metadata";
		metadataTag.appendChild(panelHead);



		for(var key in metadata){
			var value = metadata[key];
			var node = document.createElement('div');
			node.className = "panel-body";
			node.innerHTML = key + " : " + value;
			metadataTag.appendChild(node);

		};
	});
};
function buildPieChart(sample){
	//First let's get the data and OTU
	dataURL = 'samples/' + sample;
	//Hm, changes made within the Plotly don't remain outside.
	sampleValues = [];
	otuList = [];
	Plotly.d3.json(dataURL, function(error, response){
		responseValues = response[0];
		sampleValues = responseValues["sample_values"].slice(0,10);
		otuList = responseValues["otu_ids"].slice(0,10);
		//Now let's get the OTU descriptions
		otuURL = 'otu';
		Plotly.d3.json(otuURL, function(error,response){
			otuResponse = response[0]["OTU descriptions"];
			var data = [{
			values : sampleValues,
			labels : otuList,
			hovertext : otuResponse,
			type : 'pie'
			}];
			var layout = {
			height: 600,
			width : 600
			};
			Plotly.newPlot("plot", data, layout);

		});



	});
};

function buildBubbleChart(sample){
	//First let's get the data and OTU
	dataURL = 'samples/' + sample;
	//Hm, changes made within the Plotly don't remain outside.
	sampleValues = [];
	otuList = [];
	Plotly.d3.json(dataURL, function(error, response){
		responseValues = response[0];
		sampleValues = responseValues["sample_values"].slice(0,10);
		otuList = responseValues["otu_ids"].slice(0,10);
		//Now let's get the OTU descriptions
		otuURL = 'otu';
		Plotly.d3.json(otuURL, function(error,response){
			otuResponse = response[0]["OTU descriptions"];
			var data = [{
			x : otuList,
			y : sampleValues,
			mode : 'markers',
			text : otuResponse,
			marker : {
				color : otuList,
				size : sampleValues
			}
			}];
			var layout = {
			height: 600,
			width : 1200
			};
			Plotly.newPlot("bubble", data, layout);
		});
	});
};


function optionChanged(option){
	//Basically: update value of currentSample, and run all of the functions again
	currentSample = option;
	buildMetadata(currentSample);
	//More efficient: update instead of rebuilding plots everytime
	buildPieChart(currentSample);
	buildBubbleChart(currentSample);
};



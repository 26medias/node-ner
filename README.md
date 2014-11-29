# Node-NER (Named Entity Recognition) #

Node-NER uses Stanford's JAVA NER package to tag the entities in the text, then parse the output to extract the entities by type.

## Installation ##

### Dependency ###
First, you will need to download Stanford NER.

[Direct link](http://nlp.stanford.edu/software/stanford-ner-2014-10-26.zip)

[Download page](http://nlp.stanford.edu/software/CRF-NER.shtml)

Unzip anywhere, it doesn't matter.

*Note: Don't forget to have your JRE up to date, and JAVA in your PATH.*

You can make sure everything is set by opening a console, cd into the stanford-ner's directory then execute:
	java -mx1500m -cp stanford-ner.jar edu.stanford.nlp.ie.crf.CRFClassifier -loadClassifier classifiers\english.all.3class.distsim.crf.ser.gz -textFile path-to-a-text-file.txt

### NPM Package ###

	npm install node-ner
	

## Code Example ##


	var node_ner = require('node-ner');
	
	var ner = new node_ner({
		install_path:	'/path/to/stanford-ner'
	});
	
	ner.fromFile('/path/to/a/file.txt', function(entities) {
		console.log(entities);

		/*
		Output:
		{
			"ORGANIZATION": [
				"Samsung Electronics Co Ltd",
				"Microsoft",
				"Apple"
			],
			"DATE": [
				"Thursday"
			],
			"MONEY": [
				"$ 2 billion"
			]
		}
		*/
	})


## Limitations ##
You can only load from a file at this moment.
This package is under development, syntax and specs can change at any time.

# License #
[http://www.gnu.org/licenses/gpl-2.0.html](http://www.gnu.org/licenses/gpl-2.0.html)
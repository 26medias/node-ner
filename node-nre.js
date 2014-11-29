var exec 	= require('child_process').exec;
var path 	= require('path');
var _ 		= require('underscore');

function ner(options) {
	this.options = _.extend({
		install_path:	'',
		jar:			'stanford-ner.jar',
		classifier:		'english.muc.7class.distsim.crf.ser.gz'
	}, options);
}

ner.prototype.fromFile = function(filename, callback) {
	var scope = this;
	var exec = require('child_process').exec;
	exec('java -mx1500m -cp '+path.normalize(this.options.install_path+'/'+this.options.jar)+' edu.stanford.nlp.ie.crf.CRFClassifier -loadClassifier '+path.normalize(this.options.install_path+'/classifiers/'+this.options.classifier)+' -textFile '+filename, function(error, stdout, stderr) {
		if (error) {
			console.log("ERROR:", error);
			return false;
		}
		scope.parse(stdout, callback);
	});
}

ner.prototype.parse = function(parsed, callback) {
	
	var tokenized 	= parsed.split(/\s/gmi);
	var splitRegex	= new RegExp('(.+)/([A-Z]+)','g');
	
	var tagged		= _.map(tokenized, function(token) {
		var parts = new RegExp('(.+)/([A-Z]+)','g').exec(token);
		if (parts) {
			return {
				w:	parts[1],
				t:	parts[2]
			}
		}
		return null;
	});
	
	tagged = _.compact(tagged);
	
	// Now we extract the neighbors into one entity
	var entities = {};
	var i;
	var l = tagged.length;
	var prevEntity 		= false;
	var entityBuffer	= [];
	for (i=0;i<l;i++) {
		if (tagged[i].t != 'O') {
			if (tagged[i].t != prevEntity) {
				// New tag!
				// Was there a buffer?
				if (entityBuffer.length>0) {
					// There was! We save the entity
					if (!entities.hasOwnProperty(prevEntity)) {
						entities[prevEntity] = [];
					}
					entities[prevEntity].push(entityBuffer.join(' '));
					// Now we set the buffer
					entityBuffer = [];
				}
				// Push to the buffer
				entityBuffer.push(tagged[i].w);
			} else {
				// Prev entity is same a current one. We push to the buffer.
				entityBuffer.push(tagged[i].w);
			}
		} else {
			if (entityBuffer.length>0) {
				// There was! We save the entity
				if (!entities.hasOwnProperty(prevEntity)) {
					entities[prevEntity] = [];
				}
				entities[prevEntity].push(entityBuffer.join(' '));
				// Now we set the buffer
				entityBuffer = [];
			}
		}
		// Save the current entity
		prevEntity = tagged[i].t;
	}
	
	
	callback(entities);
}

module.exports		= ner;
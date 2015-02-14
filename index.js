"use-strict";

var libxslt = require('libxslt'),
    EasyXml = require('easyxml');

var XSLTtransformer = function(opts) {
    //defaults
    var defaults = {
        xml:{
            singularizeChildren: true,
            allowAttributes: true,
            rootElement: 'data',
            dateFormat: 'ISO',
            indent: 2,
            manifest: true
        },
        xsl: {
            stripXML: false
        }
    };

    // prepare the options for Object.create
    var options = {};

    for(var i in opts){
        options[i] = { 
            value: opts[i], 
            enumerable: true, 
            writeable: true, 
            configurable: true
        } 
    };

    // let Object.create merge the options with the defaults
    var config = Object.create(defaults, options);

    var serializer = new EasyXml(config.xml);

    var render = function(tplUrl,context,cb) {
        
        var xmldata = serializer.render(context._locals),
            params = context.params || {};

        console.log(xmldata);
        libxslt.parseFile(tplUrl, function(err, stylesheet){
            stylesheet.apply(xmldata, params, function(err,result) {
                var stripped = (config.xsl.stripXML)?result.replace(/<\?xml(.+?)\?>\n/g,''):result;
                cb(err,stripped);
            }); 
        });

    };

    return render;

};

module.exports = XSLTtransformer;

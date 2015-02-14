# xslt-templates
An Express-compatible XSLT rendering engine

**This is very much alpha-state, no tests yet, use it at your own risk...**

Allows to do stuff like:

    var express = require('express'),
        xslt = require('xslt-templates')
        app = express(),
        port = 8000;
    
    // assign the xslt engine to .xslt files
    var opts = {
        xsl: {
            stripXML: true
        }
    }
    
    app.engine('xslt', xslt(opts));
    
    // set .xslt as the default extension
    app.set('view engine', 'xslt');
    app.set('views', __dirname + '/templates/pages');
    
    app.get('/', function(req, res){
        res.locals = {
            params: {
                'current-page': 'home'
            },
    
            users: [
    
                {
                    _id: 123,
                    name: "Andrea",
                    nick: "nany"
                },
                {
                    _id: 222,
                    name: "Someone",
                    nick: "smn"
                },
                {
                    _id: "abc",
                    name: "Me",
                    nick: "mmmm"
                }
            ]
    
        };
        res.render('index');
    }); 
    
    
    app.listen(port);
    console.log('Express server listening on port ' + port);
    
Behind the scene the json context is converted to XML using the excellent [easyxml](https://github.com/tlhunter/node-easyxml)  library:

    <?xml version='1.0' encoding='utf-8'?>
    <data>
      <params>
        <current-page>home</current-page>
      </params>
      <users>
        <user id="123">
          <name>Andrea</name>
          <nick>nany</nick>
        </user>
        <user id="222">
          <name>Someone</name>
          <nick>smn</nick>
        </user>
        <user id="abc">
          <name>Me</name>
          <nick>mmmm</nick>
        </user>
      </users>
    </data>
    
Transformation is handled by [node-libxslt](https://github.com/albanm/node-libxslt)

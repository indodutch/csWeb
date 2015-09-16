import Utils     = require("../helpers/Utils");
import transform = require("./ITransform");
import stream  = require('stream');
import request                    = require("request");
import fs                    = require("fs");

var turf = require("turf");

class GeoJsonSaveTransformer implements transform.ITransform {
  id:          string;
  description: string;
  type = "GeoJsonSaveTransformer";

  /**
   * Accepted input types.
   */
  inputDataTypes:  transform.InputDataType[];
  /**
   * Generated output types.
   */
  outputDataTypes: transform.OutputDataType[];

  targetFolder: string;
  filenameKey: string;
  filename:string;
  generateMetadata:boolean = false;
  generateKeysOnly:boolean = false;
  nameLabel:string = "Name";
  FeatureTypeId: string;

  constructor(public title: string) {
      this.id = Utils.newGuid();
      //this.description = description;
  }

  initialize(opt: transform.ITransformFactoryOptions, callback: (error)=>void) {
    var keyPropertyParameter = opt.parameters.filter(p=>p.type.title == "filenameKeyProperty")[0];
    if (keyPropertyParameter) {
      this.filenameKey = <string>keyPropertyParameter.value;
    }

    var filenameParameter = opt.parameters.filter(p=>p.type.title == "filename")[0];
    if (filenameParameter) {
      this.filename = <string>filenameParameter.value;
    }

    var targetFolderParameter = opt.parameters.filter(p=>p.type.title == "targetFolder")[0];
    if (targetFolderParameter) {
      this.targetFolder = <string>targetFolderParameter.value;
    }

    if (!this.filename && !this.filenameKey) {
      callback("Either filename or filenameKey must be specified");
      return
    }

    var generateMetadataParameter = opt.parameters.filter(p=>p.type.title == "generateMetadata")[0];
    if (generateMetadataParameter) {
      this.generateMetadata = <boolean>generateMetadataParameter.value;
    }

    var generateKeysOnlyParameter = opt.parameters.filter(p=>p.type.title == "generateKeysOnly")[0];
    if (generateKeysOnlyParameter) {
      this.generateKeysOnly = <boolean>generateKeysOnlyParameter.value;
    }


    var nameLabelParameter = opt.parameters.filter(p=>p.type.title == "nameLabel")[0];
    if (nameLabelParameter) {
      this.nameLabel = <string>nameLabelParameter.value;
    }

    var featureTypeIdParameter = opt.parameters.filter(p=>p.type.title == "FeatureTypeId")[0];
    if (featureTypeIdParameter) {
      this.FeatureTypeId = <string>featureTypeIdParameter.value;
    }

    callback(null);
  }

  create(config, opt?: transform.ITransformFactoryOptions): NodeJS.ReadWriteStream {
    var t = new stream.Transform();
    /*stream.Transform.call(t);*/

var index = 0;
    t.setEncoding("utf8");
    t._transform =  (chunk, encoding, done) => {
       var startTs = new Date();
      // console.log((new Date().getTime() - startTs.getTime()) + ": start");
      /*console.log(index++);*/
      var featureCollection = JSON.parse(chunk);

      var propertyTypeData = {};

      if (this.generateMetadata && !featureCollection.featureTypes) {
        console.log("map %O", featureCollection.features[0].properties);
        var propertyNames = Object.getOwnPropertyNames(featureCollection.features[0].properties);
        propertyNames.forEach(p=>{
          console.log(p);
          var propValue = featureCollection.features[0].properties[p];
          var isNumeric = typeof propValue === "number";

          var result = {};
          propertyTypeData[p] =
          {
            label: p,
            title: p,
            visibleInCallOut: true,
            canEdit: false,
            isSearchable: true,
            type: isNumeric ?"number":"string",
            stringFormat: isNumeric ?"{0:0.0#}":"{0}"
          };
        });

        var typeId = this.FeatureTypeId||"Default";
        var featureTypes = {};
        featureTypes[typeId] = {
      			"name" : typeId,
      			"style" : {
              "nameLabel" : this.nameLabel,
      				"fillColor" : "#ffffffff",
      				"strokeColor" : "#000000",
      				"drawingMode" : "Point",
      				"strokeWidth" : 1,
      				"iconWidth" : 32,
      				"iconHeight" : 32,
      				"iconUri" : "cs/images/marker.png"
      			}
      	};
        console.log(JSON.stringify(featureTypes,null,4));
        if (this.generateKeysOnly) {
          featureTypes[typeId].propertyTypeKeys = propertyNames.join(";");
        } else {
          featureTypes[typeId].propertyTypeData = propertyTypeData;
        }

        featureCollection.featureTypes = featureTypes;

      }

      if (this.FeatureTypeId) {
        featureCollection.features.forEach(f=>f.properties["FeatureTypeId"] = this.FeatureTypeId);
      }

       /*console.log("##### GJST #####");*/
      // console.log("=== Before:")
      // console.log(feature);

      var filename = this.filename;
      if (this.filenameKey) {
        filename = featureCollection.features[0].properties[this.filenameKey] + ".json";
        filename = filename.replace(/[\/\\\|&;\$%@"<>\(\)\+,]/g, "");
      }


      if (!fs.existsSync(this.targetFolder)) {
        console.log("Folder does not exist, create " + this.targetFolder);
        fs.mkdirSync(this.targetFolder);
      }

      var outputStream = fs.createWriteStream(this.targetFolder + '/' + filename)
      outputStream.write(JSON.stringify(featureCollection));
      outputStream.close();
      console.log("Output written to " +this.targetFolder + "/" + filename );

      // console.log("=== After:");
      // console.log(feature);

      t.push(JSON.stringify(featureCollection));

      done();
    };

    return t;
  }

}

export = GeoJsonSaveTransformer;

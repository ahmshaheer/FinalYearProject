// source: src/protos/BoundingBox.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global = (function() {
  if (this) { return this; }
  if (typeof window !== 'undefined') { return window; }
  if (typeof global !== 'undefined') { return global; }
  if (typeof self !== 'undefined') { return self; }
  return Function('return this')();
}.call(null));

goog.exportSymbol('proto.boundingBoxPackage.BoundingBox', null, global);
goog.exportSymbol('proto.boundingBoxPackage.BoundingBoxes', null, global);
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.boundingBoxPackage.BoundingBox = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.boundingBoxPackage.BoundingBox, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.boundingBoxPackage.BoundingBox.displayName = 'proto.boundingBoxPackage.BoundingBox';
}
/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.boundingBoxPackage.BoundingBoxes = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.boundingBoxPackage.BoundingBoxes.repeatedFields_, null);
};
goog.inherits(proto.boundingBoxPackage.BoundingBoxes, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  /**
   * @public
   * @override
   */
  proto.boundingBoxPackage.BoundingBoxes.displayName = 'proto.boundingBoxPackage.BoundingBoxes';
}



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.boundingBoxPackage.BoundingBox.prototype.toObject = function(opt_includeInstance) {
  return proto.boundingBoxPackage.BoundingBox.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.boundingBoxPackage.BoundingBox} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.boundingBoxPackage.BoundingBox.toObject = function(includeInstance, msg) {
  var f, obj = {
    x: jspb.Message.getFloatingPointFieldWithDefault(msg, 1, 0.0),
    y: jspb.Message.getFloatingPointFieldWithDefault(msg, 2, 0.0),
    width: jspb.Message.getFloatingPointFieldWithDefault(msg, 3, 0.0),
    height: jspb.Message.getFloatingPointFieldWithDefault(msg, 4, 0.0),
    type: jspb.Message.getFieldWithDefault(msg, 5, ""),
    label: jspb.Message.getFieldWithDefault(msg, 6, ""),
    regex: jspb.Message.getFieldWithDefault(msg, 7, "")
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.boundingBoxPackage.BoundingBox}
 */
proto.boundingBoxPackage.BoundingBox.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.boundingBoxPackage.BoundingBox;
  return proto.boundingBoxPackage.BoundingBox.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.boundingBoxPackage.BoundingBox} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.boundingBoxPackage.BoundingBox}
 */
proto.boundingBoxPackage.BoundingBox.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setX(value);
      break;
    case 2:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setY(value);
      break;
    case 3:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setWidth(value);
      break;
    case 4:
      var value = /** @type {number} */ (reader.readFloat());
      msg.setHeight(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setType(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setLabel(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setRegex(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.boundingBoxPackage.BoundingBox.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.boundingBoxPackage.BoundingBox.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.boundingBoxPackage.BoundingBox} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.boundingBoxPackage.BoundingBox.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getX();
  if (f !== 0.0) {
    writer.writeFloat(
      1,
      f
    );
  }
  f = message.getY();
  if (f !== 0.0) {
    writer.writeFloat(
      2,
      f
    );
  }
  f = message.getWidth();
  if (f !== 0.0) {
    writer.writeFloat(
      3,
      f
    );
  }
  f = message.getHeight();
  if (f !== 0.0) {
    writer.writeFloat(
      4,
      f
    );
  }
  f = message.getType();
  if (f.length > 0) {
    writer.writeString(
      5,
      f
    );
  }
  f = message.getLabel();
  if (f.length > 0) {
    writer.writeString(
      6,
      f
    );
  }
  f = message.getRegex();
  if (f.length > 0) {
    writer.writeString(
      7,
      f
    );
  }
};


/**
 * optional float x = 1;
 * @return {number}
 */
proto.boundingBoxPackage.BoundingBox.prototype.getX = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 1, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.boundingBoxPackage.BoundingBox} returns this
 */
proto.boundingBoxPackage.BoundingBox.prototype.setX = function(value) {
  return jspb.Message.setProto3FloatField(this, 1, value);
};


/**
 * optional float y = 2;
 * @return {number}
 */
proto.boundingBoxPackage.BoundingBox.prototype.getY = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 2, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.boundingBoxPackage.BoundingBox} returns this
 */
proto.boundingBoxPackage.BoundingBox.prototype.setY = function(value) {
  return jspb.Message.setProto3FloatField(this, 2, value);
};


/**
 * optional float width = 3;
 * @return {number}
 */
proto.boundingBoxPackage.BoundingBox.prototype.getWidth = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 3, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.boundingBoxPackage.BoundingBox} returns this
 */
proto.boundingBoxPackage.BoundingBox.prototype.setWidth = function(value) {
  return jspb.Message.setProto3FloatField(this, 3, value);
};


/**
 * optional float height = 4;
 * @return {number}
 */
proto.boundingBoxPackage.BoundingBox.prototype.getHeight = function() {
  return /** @type {number} */ (jspb.Message.getFloatingPointFieldWithDefault(this, 4, 0.0));
};


/**
 * @param {number} value
 * @return {!proto.boundingBoxPackage.BoundingBox} returns this
 */
proto.boundingBoxPackage.BoundingBox.prototype.setHeight = function(value) {
  return jspb.Message.setProto3FloatField(this, 4, value);
};


/**
 * optional string type = 5;
 * @return {string}
 */
proto.boundingBoxPackage.BoundingBox.prototype.getType = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};


/**
 * @param {string} value
 * @return {!proto.boundingBoxPackage.BoundingBox} returns this
 */
proto.boundingBoxPackage.BoundingBox.prototype.setType = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};


/**
 * optional string label = 6;
 * @return {string}
 */
proto.boundingBoxPackage.BoundingBox.prototype.getLabel = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};


/**
 * @param {string} value
 * @return {!proto.boundingBoxPackage.BoundingBox} returns this
 */
proto.boundingBoxPackage.BoundingBox.prototype.setLabel = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};


/**
 * optional string regex = 7;
 * @return {string}
 */
proto.boundingBoxPackage.BoundingBox.prototype.getRegex = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};


/**
 * @param {string} value
 * @return {!proto.boundingBoxPackage.BoundingBox} returns this
 */
proto.boundingBoxPackage.BoundingBox.prototype.setRegex = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};



/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.boundingBoxPackage.BoundingBoxes.repeatedFields_ = [1];



if (jspb.Message.GENERATE_TO_OBJECT) {
/**
 * Creates an object representation of this proto.
 * Field names that are reserved in JavaScript and will be renamed to pb_name.
 * Optional fields that are not set will be set to undefined.
 * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
 * For the list of reserved names please see:
 *     net/proto2/compiler/js/internal/generator.cc#kKeyword.
 * @param {boolean=} opt_includeInstance Deprecated. whether to include the
 *     JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @return {!Object}
 */
proto.boundingBoxPackage.BoundingBoxes.prototype.toObject = function(opt_includeInstance) {
  return proto.boundingBoxPackage.BoundingBoxes.toObject(opt_includeInstance, this);
};


/**
 * Static version of the {@see toObject} method.
 * @param {boolean|undefined} includeInstance Deprecated. Whether to include
 *     the JSPB instance for transitional soy proto support:
 *     http://goto/soy-param-migration
 * @param {!proto.boundingBoxPackage.BoundingBoxes} msg The msg instance to transform.
 * @return {!Object}
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.boundingBoxPackage.BoundingBoxes.toObject = function(includeInstance, msg) {
  var f, obj = {
    boundingboxitemList: jspb.Message.toObjectList(msg.getBoundingboxitemList(),
    proto.boundingBoxPackage.BoundingBox.toObject, includeInstance)
  };

  if (includeInstance) {
    obj.$jspbMessageInstance = msg;
  }
  return obj;
};
}


/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.boundingBoxPackage.BoundingBoxes}
 */
proto.boundingBoxPackage.BoundingBoxes.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.boundingBoxPackage.BoundingBoxes;
  return proto.boundingBoxPackage.BoundingBoxes.deserializeBinaryFromReader(msg, reader);
};


/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.boundingBoxPackage.BoundingBoxes} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.boundingBoxPackage.BoundingBoxes}
 */
proto.boundingBoxPackage.BoundingBoxes.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.boundingBoxPackage.BoundingBox;
      reader.readMessage(value,proto.boundingBoxPackage.BoundingBox.deserializeBinaryFromReader);
      msg.addBoundingboxitem(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};


/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.boundingBoxPackage.BoundingBoxes.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.boundingBoxPackage.BoundingBoxes.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};


/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.boundingBoxPackage.BoundingBoxes} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.boundingBoxPackage.BoundingBoxes.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBoundingboxitemList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(
      1,
      f,
      proto.boundingBoxPackage.BoundingBox.serializeBinaryToWriter
    );
  }
};


/**
 * repeated BoundingBox boundingBoxItem = 1;
 * @return {!Array<!proto.boundingBoxPackage.BoundingBox>}
 */
proto.boundingBoxPackage.BoundingBoxes.prototype.getBoundingboxitemList = function() {
  return /** @type{!Array<!proto.boundingBoxPackage.BoundingBox>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.boundingBoxPackage.BoundingBox, 1));
};


/**
 * @param {!Array<!proto.boundingBoxPackage.BoundingBox>} value
 * @return {!proto.boundingBoxPackage.BoundingBoxes} returns this
*/
proto.boundingBoxPackage.BoundingBoxes.prototype.setBoundingboxitemList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};


/**
 * @param {!proto.boundingBoxPackage.BoundingBox=} opt_value
 * @param {number=} opt_index
 * @return {!proto.boundingBoxPackage.BoundingBox}
 */
proto.boundingBoxPackage.BoundingBoxes.prototype.addBoundingboxitem = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.boundingBoxPackage.BoundingBox, opt_index);
};


/**
 * Clears the list making it empty but non-null.
 * @return {!proto.boundingBoxPackage.BoundingBoxes} returns this
 */
proto.boundingBoxPackage.BoundingBoxes.prototype.clearBoundingboxitemList = function() {
  return this.setBoundingboxitemList([]);
};


goog.object.extend(exports, proto.boundingBoxPackage);
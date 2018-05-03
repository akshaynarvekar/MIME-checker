/**
 * @module components/fileSelector
 */

import React, { Component } from 'react';
import $ from 'jquery';
import {MIME_DATA} from './../Utils/mimeData';

class FileSelector extends Component{

  /**
   * Get a promise for a method.
   *
   * @param {string} name The API method to call.
   * @param {Object} [args={}] Arguments to send via postMessage.
   * @return {Promise}
   */
  readFileBuffer(event){
    var file = event.target.files[0],
        fileReader = new FileReader(file),
        fileHead = file.slice(0, 4);
    fileReader.onloadend = this.readSuccess.bind(this);
    fileReader.readAsArrayBuffer(fileHead);
  }

  readSuccess(event){
    if (event.target.readyState === FileReader.DONE) {
      var uint = new Uint8Array(event.target.result),
          bytes = [],
          hexVal;
      uint.forEach((byte) => {
          var byteStr = byte.toString(16);
          byteStr = byteStr.length === 1 ? '0'+byteStr : byteStr;
          bytes.push(byteStr);
      });
      hexVal = bytes.join('').toUpperCase();
      $('#files').empty().append('<span>'+this.getMIMEType(hexVal)+'</span>');
    }
  }

  getMIMEType(hexVal){
    if(MIME_DATA[hexVal] !== undefined){
      return MIME_DATA[hexVal];
    }else {
      return 'Unknown filetype';
    }
  }

  render(){
    return(
      <div>
        <div id="title-text" className="title-text">MIME Checker</div>
        <div className="upload-btn-wrapper">
          <button className="btn">Upload a file</button>
          <input type="file" name="myfile"
            onChange={(event)=> {
                   this.readFileBuffer(event);
              }}
          />
        </div>
        <div id="files"></div>
      </div>
    )
  }
}

export default FileSelector;

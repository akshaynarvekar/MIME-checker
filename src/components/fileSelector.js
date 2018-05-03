/**
 * @module components/fileSelector
 */

import React, { Component } from 'react';
import $ from 'jquery';
import {MIME_DATA} from './../Utils/mimeData';

class FileSelector extends Component{

  /**
   * Read the first 4-bytes of filestream.
   *
   * @method readFileBuffer
   * @param {Object} event On-change event of the input.
   * @return null
   */
  readFileBuffer(event){
    var file = event.target.files[0],
        fileReader = new FileReader(file),
        fileHead = file.slice(0, 4);//Get the first 4-bytes of the file signature
    fileReader.onloadend = this.readSuccess.bind(this);
    fileReader.readAsArrayBuffer(fileHead);//read the file signature as an Array Buffer
    $('.file-result-container').empty().append('<span><b>File Name: </b>'+file.name+'</span><br/><br/>');
  }

 /**
 * Callback called on completion of read.
 *
 * @method readSuccess
 * @param {Object} event On-load event of the file array buffer.
 * @return null
 */
  readSuccess(event){
    if (event.target.readyState === FileReader.DONE) {
      var uintArr = new Uint8Array(event.target.result),//Convert the result to Uint8Arry
          byteArr = [],
          hexVal;
      uintArr.forEach((elem) => {
          var elemStr = elem.toString(16);
          elemStr = elemStr.length === 1 ? '0'+elemStr : elemStr;
          byteArr.push(elemStr);
      });//Map each Uint8 value to a HEX value
      hexVal = byteArr.join('').toUpperCase();
      $('.file-result-container').append('<span><b>MIME Type: </b>'+this.getMIMEType(hexVal)+'</span>');
    }
  }

  /**
  * Retrieve the MIME type from the mapped data.
  *
  * @method getMIMEType
  * @param {string} hexVal Hexadecimal value of first 4 bytes of file signature
  * @return {string} MIME type of the file
  */
  getMIMEType(hexVal){
    if(MIME_DATA[hexVal] !== undefined){
      return MIME_DATA[hexVal];
    }else {
      return 'Unknown filetype';
    }
  }

  /**
  * Render the view of the application.
  *
  * @method render
  * @return {Template} Template of the application
  */
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
        <div id="file-result-container" className="file-result-container"></div>
      </div>
    )
  }
}

export default FileSelector;

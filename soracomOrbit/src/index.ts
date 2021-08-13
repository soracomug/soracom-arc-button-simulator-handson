import {
  orbit_set_output_content_type,
  orbit_set_output,
  getLocation,
  getTagValue,
  getInputBufferAsString,
} from "orbit-sdk-assemblyscript";

import { JSON, JSONEncoder } from "assemblyscript-json";

/**
 * process uplink (device -> SORACOM) message
 */
export function uplink(): i32 {
  // decode input string as JSON string
  let data: JSON.Obj = <JSON.Obj>(JSON.parse(getInputBufferAsString()));

  // create a new encoder which will be used to generate final JSON string
  // const encoder = new JSONEncoder();
  // get location information
  const location = getLocation();
  let locationLat: f64 = 0.0;
  let locationLon: f64 = 0.0;
  if (location.lat.toString() !== "NaN") {
    locationLat = location.lat;
  }
  if (location.lon.toString() != "NaN") {
    locationLon = location.lon;
  }

  const tagname = getTagValue("name");
  const clickTypeName  = data.getString("clickTypeName") != null ? data.getString("clickTypeName")!.valueOf() : "";
  let clickTypeNameJp = "";
  if (clickTypeName == "SINGLE") {
    clickTypeNameJp = "シングルクリック"
  } else if (clickTypeName == "DOUBLE") {
    clickTypeNameJp = "ダブルクリック"
  } else if (clickTypeName == "LONG") {
    clickTypeNameJp = "長押し"
  } else {
    clickTypeNameJp = "不明"
  }
  const message = tagname + "が" + clickTypeNameJp + "されました。\nおおよその位置：緯度:" + locationLat.toString() + " 経度:" + locationLon.toString() + "\n https://www.google.com/maps?q=" + locationLat.toString() + "," + locationLon.toString();
  
  const contentType = "application/x-www-form-urlencoded";
  // JSON オブジェクトを文字列に変換し出力としてセット

  const contentTypeBuffer = String.UTF8.encode(contentType);
  const jsonBuffer = String.UTF8.encode("message=" + message);
  const contentTypeMem = changetype<i32>(contentTypeBuffer);
  const jsonMem = changetype<i32>(jsonBuffer);

  orbit_set_output(jsonMem, jsonBuffer.byteLength);
  orbit_set_output_content_type(contentTypeMem, contentTypeBuffer.byteLength);


  // return user defined result code for success
  return 0;
}

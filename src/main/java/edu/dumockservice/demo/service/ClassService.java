package edu.dumockservice.demo.service;

import java.util.List;
import org.iq80.leveldb.DBIterator;
import org.iq80.leveldb.impl.Iq80DBFactory;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import edu.dumockservice.demo.util.DBs;
import edu.dumockservice.demo.util.Utils;

/**
 * Created by skatkoori.
 */
@org.springframework.web.bind.annotation.RestController
@RequestMapping("/my")
public class ClassService
{
  @Autowired
  BaseService baseService;
  
  public ClassService() {}
  
  @RequestMapping(value="/classes", method={org.springframework.web.bind.annotation.RequestMethod.GET})
  public JSONObject getAllClasses()
  {
    DBIterator iterator = DBs.ClASSES.getInstance().iterator();
    if ((baseService.getList(iterator).isEmpty()) || (baseService.getList(iterator).size() == 0)) {
      return new JSONObject();
    }
    return (JSONObject)baseService.getList(iterator).get(0);
  }
  
  @RequestMapping(value="/getClass/{classId}", method={org.springframework.web.bind.annotation.RequestMethod.GET})
  public JSONObject getClass(@PathVariable String classId) {
    String target = Iq80DBFactory.asString(DBs.ClASSES.getInstance().get(Iq80DBFactory.bytes(classId)));
    return baseService.get(target);
  }
  
  @RequestMapping(value="/addClasses", method={org.springframework.web.bind.annotation.RequestMethod.POST})
  public JSONObject addClasses(@RequestBody JSONObject obj) {
    try {
      String tempId = Utils.getUUId().toString();
      JSONObject jsonObject = (JSONObject)new JSONParser().parse(obj.toString());
      jsonObject.put("tempId", tempId);
      DBs.ClASSES.getInstance().put(Iq80DBFactory.bytes(tempId), Iq80DBFactory.bytes(jsonObject.toString()));
      return getAllClasses();
    } catch (Exception e) {
      e.printStackTrace(); }
    return null;
  }
  

  @RequestMapping(value="/editClass", method={org.springframework.web.bind.annotation.RequestMethod.POST})
  public JSONObject editClass(@RequestBody JSONObject obj)
  {
    String tempId = obj.get("tempId").toString();
    try {
      DBs.ClASSES.getInstance().delete(Iq80DBFactory.bytes(tempId));
      JSONObject jsonObject = baseService.update(obj.toString());
      jsonObject.put("tempId", tempId);
      DBs.ClASSES.getInstance().put(Iq80DBFactory.bytes(tempId), Iq80DBFactory.bytes(jsonObject.toString()));
      return getAllClasses();
    } catch (Exception e) {
      e.printStackTrace(); }
    return null;
  }
  
  @RequestMapping(value="/deleteClasses", method={org.springframework.web.bind.annotation.RequestMethod.POST})
  public JSONObject deleteClasses(@RequestBody List<JSONObject> array)
  {
    try {
      for (JSONObject obj : array) {
        DBs.ClASSES.getInstance().delete(Iq80DBFactory.bytes(obj.get("tempId").toString()));
      }
      return getAllClasses();
    } catch (Exception e) {
      e.printStackTrace(); }
    return null;
  }
  
  @RequestMapping(value="/deleteClass/{classId}", method={org.springframework.web.bind.annotation.RequestMethod.POST})
  public JSONObject deleteClass(@PathVariable String classId)
  {
    try {
      DBs.ClASSES.getInstance().delete(Iq80DBFactory.bytes(classId));
      return getAllClasses();
    } catch (Exception e) {
      e.printStackTrace(); }
    return null;
  }
}
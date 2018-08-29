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
public class GradeService
{
  @Autowired
  BaseService baseService;
  
  public GradeService() {}
  
  @RequestMapping(value="/grades", method={org.springframework.web.bind.annotation.RequestMethod.GET})
  public JSONObject getAllGrades()
  {
    DBIterator iterator = DBs.GRADES.getInstance().iterator();
    if ((baseService.getList(iterator).isEmpty()) || (baseService.getList(iterator).size() == 0)) {
      return new JSONObject();
    }
    return (JSONObject)baseService.getList(iterator).get(0);
  }
  
  @RequestMapping(value="/getGrade/{gradeId}", method={org.springframework.web.bind.annotation.RequestMethod.GET})
  public JSONObject getGrades(@PathVariable String gradeId) {
    String target = Iq80DBFactory.asString(DBs.GRADES.getInstance().get(Iq80DBFactory.bytes(gradeId)));
    return baseService.get(target);
  }
  
  @RequestMapping(value="/addGrades", method={org.springframework.web.bind.annotation.RequestMethod.POST})
  public JSONObject addGrades(@RequestBody JSONObject obj) {
    try {
      String tempId = Utils.getUUId().toString();
      JSONObject jsonObject = (JSONObject)new JSONParser().parse(obj.toString());
      jsonObject.put("tempId", tempId);
      DBs.GRADES.getInstance().put(Iq80DBFactory.bytes(tempId), Iq80DBFactory.bytes(jsonObject.toString()));
      return getAllGrades();
    } catch (Exception e) {
      e.printStackTrace(); }
    return null;
  }
  

  @RequestMapping(value="/editGrade", method={org.springframework.web.bind.annotation.RequestMethod.POST})
  public JSONObject editGrade(@RequestBody JSONObject obj)
  {
    String tempId = obj.get("tempId").toString();
    try {
      DBs.GRADES.getInstance().delete(Iq80DBFactory.bytes(tempId));
      JSONObject jsonObject = baseService.update(obj.toString());
      jsonObject.put("tempId", tempId);
      DBs.GRADES.getInstance().put(Iq80DBFactory.bytes(tempId), Iq80DBFactory.bytes(jsonObject.toString()));
      return getAllGrades();
    } catch (Exception e) {
      e.printStackTrace(); }
    return null;
  }
  
  @RequestMapping(value="/deleteGrades", method={org.springframework.web.bind.annotation.RequestMethod.POST})
  public JSONObject deleteGrades(@RequestBody List<JSONObject> array)
  {
    try {
      for (JSONObject obj : array) {
        DBs.GRADES.getInstance().delete(Iq80DBFactory.bytes(obj.get("tempId").toString()));
      }
      return getAllGrades();
    } catch (Exception e) {
      e.printStackTrace(); }
    return null;
  }
  
  @RequestMapping(value="/deleteGrade/{gradeId}", method={org.springframework.web.bind.annotation.RequestMethod.POST})
  public JSONObject deleteGrade(@PathVariable String gradeId)
  {
    try {
      DBs.GRADES.getInstance().delete(Iq80DBFactory.bytes(gradeId));
      return getAllGrades();
    } catch (Exception e) {
      e.printStackTrace(); }
    return null;
  }
}
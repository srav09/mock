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
public class IncompletesService
{
  @Autowired
  BaseService baseService;
  
  public IncompletesService() {}
  
  @RequestMapping(value="/incompletes", method={org.springframework.web.bind.annotation.RequestMethod.GET})
  public JSONObject getAllIncompletes()
  {
    DBIterator iterator = DBs.INCOMPLETES.getInstance().iterator();
    if ((baseService.getList(iterator).isEmpty()) || (baseService.getList(iterator).size() == 0)) {
      return new JSONObject();
    }
    return (JSONObject)baseService.getList(iterator).get(0);
  }
  
  @RequestMapping(value="/getIncomplete/{incompleteId}", method={org.springframework.web.bind.annotation.RequestMethod.GET})
  public JSONObject getIncompletes(@PathVariable String incompleteId) {
    String target = Iq80DBFactory.asString(DBs.INCOMPLETES.getInstance().get(Iq80DBFactory.bytes(incompleteId)));
    return baseService.get(target);
  }
  
  @RequestMapping(value="/addIncompletes", method={org.springframework.web.bind.annotation.RequestMethod.POST})
  public JSONObject addIncompletes(@RequestBody JSONObject obj) {
    try {
      String tempId = Utils.getUUId().toString();
      JSONObject jsonObject = (JSONObject)new JSONParser().parse(obj.toString());
      jsonObject.put("tempId", tempId);
      DBs.INCOMPLETES.getInstance().put(Iq80DBFactory.bytes(tempId), Iq80DBFactory.bytes(jsonObject.toString()));
      return getAllIncompletes();
    } catch (Exception e) {
      e.printStackTrace(); }
    return null;
  }
  

  @RequestMapping(value="/editIncompletes", method={org.springframework.web.bind.annotation.RequestMethod.POST})
  public JSONObject editIncompletes(@RequestBody JSONObject obj)
  {
    String tempId = obj.get("tempId").toString();
    try {
      DBs.INCOMPLETES.getInstance().delete(Iq80DBFactory.bytes(tempId));
      JSONObject jsonObject = baseService.update(obj.toString());
      jsonObject.put("tempId", tempId);
      DBs.INCOMPLETES.getInstance().put(Iq80DBFactory.bytes(tempId), Iq80DBFactory.bytes(jsonObject.toString()));
      return getAllIncompletes();
    } catch (Exception e) {
      e.printStackTrace(); }
    return null;
  }
  
  @RequestMapping(value="/deleteIncompletes", method={org.springframework.web.bind.annotation.RequestMethod.POST})
  public JSONObject deleteIncompletes(@RequestBody List<JSONObject> array)
  {
    try {
      for (JSONObject obj : array) {
        DBs.INCOMPLETES.getInstance().delete(Iq80DBFactory.bytes(obj.get("tempId").toString()));
      }
      return getAllIncompletes();
    } catch (Exception e) {
      e.printStackTrace(); }
    return null;
  }
  
  @RequestMapping(value="/deleteIncomplete/{incompleteId}", method={org.springframework.web.bind.annotation.RequestMethod.POST})
  public JSONObject deleteIncomplete(@PathVariable String incompleteId)
  {
    try {
      DBs.INCOMPLETES.getInstance().delete(Iq80DBFactory.bytes(incompleteId));
      return getAllIncompletes();
    } catch (Exception e) {
      e.printStackTrace(); }
    return null;
  }
}
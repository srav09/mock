package edu.dumockservice.demo.service;

import edu.dumockservice.demo.util.DBs;
import edu.dumockservice.demo.util.Utils;
import org.iq80.leveldb.DBIterator;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.iq80.leveldb.impl.Iq80DBFactory.asString;
import static org.iq80.leveldb.impl.Iq80DBFactory.bytes;

/**
 * Created by skatkoori.
 */
@RestController
@RequestMapping("/my")
public class HoldService{

    @Autowired
    BaseService baseService;

    @RequestMapping(value = "/holds", method = RequestMethod.GET)
    public List<JSONObject> getAllHolds(){
        DBIterator iterator = DBs.HOLDS.getInstance().iterator();
        return baseService.getList(iterator);
    }

    @RequestMapping(value = "/getHold/{holdId}", method = RequestMethod.GET)
    public JSONObject getHold(@PathVariable String holdId){
        String target = asString(DBs.HOLDS.getInstance().get(bytes(holdId)));
        return baseService.get(target);
    }

    @RequestMapping(value = "/addHolds", method = RequestMethod.POST)
    public List<JSONObject> addHolds(@RequestBody String str){
        try {
            if(str.startsWith("[")) {
                JSONArray jsonArray = (JSONArray) (new JSONParser().parse(str));
                for (Object o : jsonArray) {
                    String tempId = Utils.getUUId().toString();
                    JSONObject jsonObject = (JSONObject) o;
                    jsonObject.put("tempId", tempId);
                    DBs.HOLDS.getInstance().put(bytes(tempId), bytes(jsonObject.toString()));
                }
            }else if(str.startsWith("{")){
                String tempId = Utils.getUUId().toString();
                JSONObject jsonObject = (JSONObject) (new JSONParser().parse(str));
                jsonObject.put("tempId", tempId);
                DBs.HOLDS.getInstance().put(bytes(tempId), bytes(jsonObject.toString()));
            }else{
                return null;
            }
            return getAllHolds();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/editHold", method = RequestMethod.POST)
    public List<JSONObject> editHold(@RequestBody JSONObject obj){
        String tempId = obj.get("tempId").toString();
        try{
            DBs.HOLDS.getInstance().delete(bytes(tempId));
            JSONObject jsonObject = baseService.update(obj.toString());
            jsonObject.put("tempId", tempId);
            DBs.HOLDS.getInstance().put(bytes(tempId), bytes(jsonObject.toString()));
            return getAllHolds();
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/deleteHolds", method = RequestMethod.POST)
    public List<JSONObject> deleteHolds(@RequestBody List<JSONObject> array){
        try{
            for(JSONObject obj: array){
                DBs.HOLDS.getInstance().delete(bytes(obj.get("tempId").toString()));
            }
            return getAllHolds();
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/deleteHold/{holdId}",method = RequestMethod.POST)
    public List<JSONObject> deleteHold(@PathVariable String holdId){
        try {
            DBs.HOLDS.getInstance().delete(bytes(holdId));
            return getAllHolds();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

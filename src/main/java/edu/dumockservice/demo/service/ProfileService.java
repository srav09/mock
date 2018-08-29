package edu.dumockservice.demo.service;

import edu.dumockservice.demo.util.DBs;
import edu.dumockservice.demo.util.Utils;
import org.iq80.leveldb.DBIterator;
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
public class ProfileService {

    @Autowired
    BaseService baseService;

    @RequestMapping(value = "/profile", method = RequestMethod.GET)
    public JSONObject getAllProfiles() {
        DBIterator iterator = DBs.PROFILES.getInstance().iterator();
        if(baseService.getList(iterator).isEmpty() || baseService.getList(iterator).size() == 0){
            return new JSONObject();
        }
        return baseService.getList(iterator).get(0);
    }

    @RequestMapping(value = "/getProfile/{profileId}", method = RequestMethod.GET)
    public JSONObject getProfile(@PathVariable String profileId) {
        String target = asString(DBs.PROFILES.getInstance().get(bytes(profileId)));
        return baseService.get(target);
    }

    @RequestMapping(value = "/addProfile", method = RequestMethod.POST)
    public JSONObject addProfiles(@RequestBody JSONObject obj) {
        try {
            String tempId = Utils.getUUId().toString();
            JSONObject jsonObject = (JSONObject) (new JSONParser().parse(obj.toString()));
            jsonObject.put("tempId", tempId);
            DBs.PROFILES.getInstance().put(bytes(tempId), bytes(jsonObject.toString()));
            return getAllProfiles();
        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/editProfile", method = RequestMethod.POST)
    public JSONObject editProfile(@RequestBody JSONObject obj) {
        String tempId = obj.get("tempId").toString();
        try {
            DBs.PROFILES.getInstance().delete(bytes(tempId));
            JSONObject jsonObject = baseService.update(obj.toString());
            jsonObject.put("tempId", tempId);
            DBs.PROFILES.getInstance().put(bytes(tempId), bytes(jsonObject.toString()));
            return getAllProfiles();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/deleteProfiles", method = RequestMethod.POST)
    public JSONObject deleteProfiles(@RequestBody List<JSONObject> array) {
        try {
            for (JSONObject obj : array) {
                DBs.PROFILES.getInstance().delete(bytes(obj.get("tempId").toString()));
            }
            return getAllProfiles();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/deleteProfile/{profileId}", method = RequestMethod.POST)
    public JSONObject deleteProfile(@PathVariable String profileId) {
        try {
            DBs.PROFILES.getInstance().delete(bytes(profileId));
            return getAllProfiles();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

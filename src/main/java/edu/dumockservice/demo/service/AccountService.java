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
public class AccountService {

    @Autowired
    BaseService baseService;

    @RequestMapping(value = "/account", method = RequestMethod.GET)
    public JSONObject getAllAcc() {
        DBIterator iterator = DBs.ACCOUNTBALANCE.getInstance().iterator();
        if(baseService.getList(iterator).isEmpty() || baseService.getList(iterator).size() == 0){
            return new JSONObject();
        }
        return baseService.getList(iterator).get(0);
    }

    @RequestMapping(value = "/getAccBal/{accBalanceId}", method = RequestMethod.GET)
    public JSONObject getAccBalance(@PathVariable String accBalanceId) {
        String target = asString(DBs.HOLDS.getInstance().get(bytes(accBalanceId)));
        return baseService.get(target);
    }

    @RequestMapping(value = "/addAccBals", method = RequestMethod.POST)
    public JSONObject addAccBalance(@RequestBody JSONObject obj) {
        try {
            String tempId = Utils.getUUId().toString();
            JSONObject jsonObject = (JSONObject) (new JSONParser().parse(obj.toString()));
            jsonObject.put("tempId", tempId);
            DBs.ACCOUNTBALANCE.getInstance().put(bytes(tempId), bytes(jsonObject.toString()));
            return getAllAcc();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/editAccBal", method = RequestMethod.POST)
    public JSONObject editAccBal(@RequestBody JSONObject obj) {
        String tempId = obj.get("tempId").toString();
        try {
            DBs.ACCOUNTBALANCE.getInstance().delete(bytes(tempId));
            JSONObject jsonObject = baseService.update(obj.toString());
            jsonObject.put("tempId", tempId);
            DBs.ACCOUNTBALANCE.getInstance().put(bytes(tempId), bytes(jsonObject.toString()));
            return getAllAcc();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/deleteAccBals", method = RequestMethod.POST)
    public JSONObject deleteAccBals(@RequestBody List<JSONObject> array) {
        try {
            for (JSONObject obj : array) {
                DBs.ACCOUNTBALANCE.getInstance().delete(bytes(obj.get("tempId").toString()));
            }
            return getAllAcc();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/deleteAccBal/{accBalanceId}", method = RequestMethod.POST)
    public JSONObject deleteAccBalance(@PathVariable String accBalanceId) {
        try {
            DBs.ACCOUNTBALANCE.getInstance().delete(bytes(accBalanceId));
            return getAllAcc();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}

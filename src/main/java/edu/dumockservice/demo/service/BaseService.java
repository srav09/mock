package edu.dumockservice.demo.service;

import edu.dumockservice.demo.util.Utils;
import org.iq80.leveldb.DBIterator;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.iq80.leveldb.impl.Iq80DBFactory.asString;

/**
 * Created by skatkoori.
 */
public class BaseService {

    public List<JSONObject> getList(DBIterator iterator) {
        List<JSONObject> list = new ArrayList<>();
        try {
            for(iterator.seekToFirst(); iterator.hasNext(); iterator.next()) {
                String value = asString(iterator.peekNext().getValue());
                JSONObject jsonObject = (JSONObject) (new JSONParser().parse(value));
                list.add(jsonObject);
            }
        }catch (Exception e){
            e.printStackTrace();
        }
        finally {
            try {
                iterator.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return list;
    }

    public JSONObject get(String target){
        try {
            JSONObject jsonObject = (JSONObject)(new JSONParser().parse(target));
            return jsonObject;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public JSONObject update(String target){
        String tempId = Utils.getUUId().toString();
        JSONObject jsonObject = null;
        try {
            jsonObject = (JSONObject)(new JSONParser().parse(target));
        } catch (ParseException e) {
            e.printStackTrace();
        }
        jsonObject.put("tempId",tempId);
        return jsonObject;
    }
}

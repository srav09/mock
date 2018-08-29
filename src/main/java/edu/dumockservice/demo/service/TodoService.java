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
public class TodoService{

    @Autowired
    BaseService baseService;

    @RequestMapping(value = "/todos", method = RequestMethod.GET)
    public List<JSONObject> getAllTodos(){
        DBIterator iterator = DBs.TODOS.getInstance().iterator();
        return baseService.getList(iterator);
    }

    @RequestMapping(value = "/getTodo/{todoId}", method = RequestMethod.GET)
    public JSONObject getTodo(@PathVariable String todoId){
        String target = asString(DBs.TODOS.getInstance().get(bytes(todoId)));
        return baseService.get(target);
    }

    @RequestMapping(value = "/addTodos", method = RequestMethod.POST)
    public List<JSONObject> addTodos(@RequestBody String str){
        try {
            if(str.startsWith("[")) {
                JSONArray jsonArray = (JSONArray) (new JSONParser().parse(str));
                for (Object o : jsonArray) {
                    String tempId = Utils.getUUId().toString();
                    JSONObject jsonObject = (JSONObject) o;
                    jsonObject.put("tempId", tempId);
                    DBs.TODOS.getInstance().put(bytes(tempId), bytes(jsonObject.toString()));
                }
            }else if(str.startsWith("{")){
                String tempId = Utils.getUUId().toString();
                JSONObject jsonObject = (JSONObject) (new JSONParser().parse(str));
                jsonObject.put("tempId", tempId);
                DBs.TODOS.getInstance().put(bytes(tempId), bytes(jsonObject.toString()));
            }else{
                return null;
            }
            return getAllTodos();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/editTodo", method = RequestMethod.POST)
    public List<JSONObject> editTodo(@RequestBody JSONObject obj){
        String tempId = obj.get("tempId").toString();
        try{
            DBs.TODOS.getInstance().delete(bytes(tempId));
            JSONObject jsonObject = baseService.update(obj.toString());
            jsonObject.put("tempId", tempId);
            DBs.TODOS.getInstance().put(bytes(tempId), bytes(jsonObject.toString()));
            return getAllTodos();
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/deleteTodos", method = RequestMethod.POST)
    public List<JSONObject> deleteTodos(@RequestBody List<JSONObject> array){
        try{
            for(JSONObject obj: array){
                DBs.TODOS.getInstance().delete(bytes(obj.get("tempId").toString()));
            }
            return getAllTodos();
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }

    @RequestMapping(value = "/deleteTodo/{todoId}",method = RequestMethod.POST)
    public List<JSONObject> deleteTodo(@PathVariable String todoId){
        try {
            DBs.TODOS.getInstance().delete(bytes(todoId));
            return getAllTodos();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

}

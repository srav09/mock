package edu.dumockservice.demo.util;

import java.util.UUID;

/**
 * Created by skatkoori.
 */
public class Utils {

    public static String getUUId(){
        String s = UUID.randomUUID().toString();
        return  s.substring(0,8)+s.substring(9,13)+s.substring(14,18)+s.substring(19,23)+s.substring(24);
    }

}

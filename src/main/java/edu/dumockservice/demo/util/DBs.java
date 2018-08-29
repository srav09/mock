package edu.dumockservice.demo.util;

import org.iq80.leveldb.DB;
import org.iq80.leveldb.Options;

import static org.iq80.leveldb.impl.Iq80DBFactory.factory;
import java.io.File;
import java.io.IOException;

/**
 * Created by skatkoori.
 */
public enum DBs {
    TODOS("todos"),
    HOLDS("holds"),
    ACCOUNTBALANCE("accBalance"),
    ClASSES("classes"),
    PROFILES("profiles"),
    GRADES("grades"),
	INCOMPLETES("incompletes");

    private String name = null;
    private DB dbInstance = null;

    private DBs(String name){
        String path = "/usr/share/tomcat8/webapps/demo-0.0.1-SNAPSHOT/WEB-INF/duDataBase";
        this.name = name;
        Options options = new Options().createIfMissing(true);
        try {
            dbInstance = factory.open(new File(path,name), options);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public DB getInstance() {
        return this.dbInstance;
    }

}

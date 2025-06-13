package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class AddSongHandler implements Route {
  public StorageInterface storageHandler;

  public AddSongHandler(StorageInterface storageHandler) {
    this.storageHandler = storageHandler;
  }

  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();
    try {
      String uid = request.queryParams("uid");
      String title = request.queryParams("title");
      String lyrics = request.queryParams("lyrics");
      String chords = request.queryParams("chords");

      Map<String, Object> data = new HashMap<>();
      data.put("title", title);
      data.put("chords", chords);
      data.put("lyrics", lyrics);

      this.storageHandler.addDocument(uid, "songs", title, data);

      responseMap.put("response_type", "success");

    } catch (Exception e) {
      e.printStackTrace();
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }
}

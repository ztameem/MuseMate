package edu.brown.cs.student.main.server.handlers;

import com.google.gson.Gson;
import edu.brown.cs.student.main.server.storage.FirebaseUtilities;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import spark.Request;
import spark.Response;
import spark.Route;

public class GetSongHistoryHandler implements Route {
  private final FirebaseUtilities firebaseUtilities;
  private final Gson gson = new Gson();

  public GetSongHistoryHandler(FirebaseUtilities firebaseUtilities) {
    this.firebaseUtilities = firebaseUtilities;
  }

  @Override
  public Object handle(Request request, Response response) {
    String userId = request.queryParams("userId");
    if (userId == null || userId.isEmpty()) {
      response.status(400);
      return "Missing or invalid user ID";
    }

    try {
      List<Map<String, Object>> songHistory = firebaseUtilities.getUserSongs(userId);
      response.status(200);
      return gson.toJson(songHistory);
    } catch (ExecutionException | InterruptedException e) {
      response.status(500);
      return "Failed to fetch song history: " + e.getMessage();
    }
  }
}

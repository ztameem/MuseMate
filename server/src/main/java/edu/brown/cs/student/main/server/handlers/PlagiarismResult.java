package edu.brown.cs.student.main.server.handlers;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import java.lang.reflect.Type;
import java.util.LinkedHashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class PlagiarismResult implements Route {
  Map<String, Object> responseMap = new LinkedHashMap<>();

  public PlagiarismResult() {
    responseMap.put("status", "loading");
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    Moshi moshi = new Moshi.Builder().build();
    Type type = Types.newParameterizedType(Map.class, String.class, Object.class);
    JsonAdapter<Map<String, Object>> jsonAdapter = moshi.adapter(type);
    Map<String, Object> resultsMap = jsonAdapter.fromJson(request.body());
    Map<String, Object> scannedDocument = (Map<String, Object>) resultsMap.get("scannedDocument");
    String scanID = (String) scannedDocument.get("scanId");
    Map<String, Object> enabled = (Map<String, Object>) scannedDocument.get("enabled");
    boolean plagiarismDetection = (boolean) enabled.get("plagiarismDetection");
    boolean aiDetection = (boolean) enabled.get("aiDetection");
    Map<String, Object> results = (Map<String, Object>) resultsMap.get("results");
    Map<String, Object> score = (Map<String, Object>) results.get("score");
    double aggregratedScore = (double) score.get("aggregatedScore");

    responseMap.put("status", "complete");
    responseMap.put("scanID", scanID);
    Map<String, Object> data = new LinkedHashMap<>();
    data.put("plagiarismDetection", plagiarismDetection);
    data.put("aiDetection", aiDetection);
    data.put("aggregratedScore", aggregratedScore);
    responseMap.put("data", data);
    System.out.println(responseMap);
    return null;
  }

  public Map<String, Object> getResponseMap() {
    return responseMap;
  }
}

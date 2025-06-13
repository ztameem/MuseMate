package edu.brown.cs.student;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.server.handlers.*;
import java.io.IOException;
import java.lang.reflect.Type;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import spark.Spark;

public class ServerTest {
  @BeforeAll
  public static void setUpBeforeAll() {
    Spark.port(3232);
  }

  @BeforeEach
  public void setup() {
    PlagiarismResult plagiarismResult;
    Spark.get("rhyme", new RhymeHandler());
    Spark.get("check", new PlagiarismHandler());
    Spark.post("webhook/completed", plagiarismResult = new PlagiarismResult());
    Spark.get(
        "plagiarism-result",
        (request, response) -> {
          Map<String, Object> result = plagiarismResult.getResponseMap();
          if (result != null) {
            return Utils.toMoshiJson(result);
          } else {
            response.status(404);
            return "No plagiarism result found.";
          }
        });
    Spark.init();
    Spark.awaitInitialization();
  }

  @AfterEach
  public void teardown() {
    Spark.unmap("/check");
    Spark.unmap("/rhyme");
    Spark.unmap("/plagiarism-result");
    Spark.awaitStop();
  }

  private static HttpURLConnection tryRequest(String apiCall) throws IOException {
    URL requestURL = new URL("http://localhost:" + Spark.port() + "/" + apiCall);
    HttpURLConnection clientConnection = (HttpURLConnection) requestURL.openConnection();
    clientConnection.setRequestMethod("GET");
    clientConnection.connect();
    return clientConnection;
  }

  @Test
  public void testSubmitRhyme() throws IOException, InterruptedException {
    HttpURLConnection clientConnection = tryRequest("/rhyme?word=hi");
    assertEquals(200, clientConnection.getResponseCode());

    Moshi moshi = new Moshi.Builder().build();
    Type type = Types.newParameterizedType(Map.class, String.class, Object.class);
    JsonAdapter<Map<String, Object>> jsonAdapter = moshi.adapter(type);
    String responseString = new String(clientConnection.getInputStream().readAllBytes());
    Map<String, Object> responseMap = jsonAdapter.fromJson(responseString);
    assertEquals("success", responseMap.get("response_type"));
    clientConnection.disconnect();
  }

  @Test
  public void testSubmitPlagiarismCheck() throws IOException, InterruptedException {
    HttpURLConnection clientConnection =
        tryRequest("/check?text=If%20you,%20if%20you%20could%20return");
    assertEquals(200, clientConnection.getResponseCode());
    Moshi moshi = new Moshi.Builder().build();
    Type type = Types.newParameterizedType(Map.class, String.class, Object.class);
    JsonAdapter<Map<String, Object>> jsonAdapter = moshi.adapter(type);
    String responseString = new String(clientConnection.getInputStream().readAllBytes());
    System.out.println(responseString);
    Map<String, Object> responseMap = jsonAdapter.fromJson(responseString);
    assertEquals("success", responseMap.get("response_type"));
    assertTrue(responseMap.containsKey("scanID"));
  }
}

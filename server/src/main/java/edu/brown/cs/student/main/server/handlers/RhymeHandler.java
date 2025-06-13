package edu.brown.cs.student.main.server.handlers;

import static edu.brown.cs.student.main.server.handlers.Utils.toMoshiJson;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import io.github.cdimascio.dotenv.Dotenv;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;
import spark.Request;
import spark.Response;
import spark.Route;

public class RhymeHandler implements Route {
  @Override
  public Object handle(Request request, Response response) throws IOException {
    Map<String, Object> responseMap = new LinkedHashMap<>();
    String word = request.queryParams("word");
    Dotenv dotenv = Dotenv.load();
    String apiKey = dotenv.get("API_NINJAS_API_KEY");

    URL url = new URL("https://api.api-ninjas.com/v1/rhyme?word=" + word);
    HttpURLConnection connection = (HttpURLConnection) url.openConnection();
    connection.setRequestProperty("accept", "application/json");
    connection.setRequestProperty("X-Api-Key", apiKey);
    try {
      InputStream responseStream = connection.getInputStream();
      BufferedReader reader = new BufferedReader(new InputStreamReader(responseStream));
      StringBuilder result = new StringBuilder();
      String line;
      while ((line = reader.readLine()) != null) {
        result.append(line);
      }
      Moshi moshi = new Moshi.Builder().build();
      JsonAdapter<String[]> adapter = moshi.adapter(String[].class);
      String[] rhymingWords = adapter.fromJson(result.toString());

      if (rhymingWords != null && rhymingWords.length > 0) {
        List<String> selectedWords = selectWords(Arrays.asList(rhymingWords));

        responseMap.put("response_type", "success");
        responseMap.put("data", selectedWords);
      } else {
        responseMap.put("response_type", "error");
        responseMap.put("message", "No rhyming words found.");
      }
    } catch (IOException e) {
      responseMap.put("response_type", "error");
      responseMap.put("message", e.getMessage());
    }
    return toMoshiJson(responseMap);
  }

  private List<String> selectWords(List<String> rhymingWords) {
    Map<Character, List<String>> groupedByLetter = new LinkedHashMap<>();
    for (String word : rhymingWords) {
      char startingLetter = word.toLowerCase().charAt(0);
      groupedByLetter.computeIfAbsent(startingLetter, k -> new ArrayList<>()).add(word);
    }

    List<String> selectedWords = new ArrayList<>();
    boolean wordsRemaining = true;

    while (wordsRemaining && selectedWords.size() < 10) {
      wordsRemaining = false;
      for (List<String> group : groupedByLetter.values()) {
        if (!group.isEmpty()) {
          selectedWords.add(group.remove(0));
          wordsRemaining = true;
          if (selectedWords.size() >= 10) {
            break;
          }
        }
      }
    }

    selectedWords.sort(Comparator.comparingInt(word -> word.toLowerCase().charAt(0)));
    return selectedWords;
  }
}

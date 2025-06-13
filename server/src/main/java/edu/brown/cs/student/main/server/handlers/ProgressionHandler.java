package edu.brown.cs.student.main.server.handlers;

import static edu.brown.cs.student.main.server.handlers.Utils.toMoshiJson;

import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class ProgressionHandler implements Route {

  private Map<String, String[]> majorScales = new HashMap<>();
  private Map<String, String[]> minorScales = new HashMap<>();

  public ProgressionHandler() {
    // Major scales: The I, II, III, IV, V, VI, VII chords (major scale)
    majorScales.put("C", new String[] {"C", "D", "E", "F", "G", "A", "B"});
    majorScales.put("D", new String[] {"D", "E", "F#", "G", "A", "B", "C#"});
    majorScales.put("E", new String[] {"E", "F#", "G#", "A", "B", "C#", "D#"});
    majorScales.put("F", new String[] {"F", "G", "A", "Bb", "C", "D", "E"});
    majorScales.put("G", new String[] {"G", "A", "B", "C", "D", "E", "F#"});
    majorScales.put("A", new String[] {"A", "B", "C#", "D", "E", "F#", "G#"});
    majorScales.put("B", new String[] {"B", "C#", "D#", "E", "F#", "G#", "A#"});

    // Minor scales: Natural minor scale for simplicity (i, ii, III, iv, v, VI, VII)
    minorScales.put("C", new String[] {"C", "D", "Eb", "F", "G", "Ab", "Bb"});
    minorScales.put("D", new String[] {"D", "E", "F", "G", "A", "Bb", "C"});
    minorScales.put("E", new String[] {"E", "F#", "G", "A", "B", "C", "D"});
    minorScales.put("F", new String[] {"F", "G", "Ab", "Bb", "C", "Db", "Eb"});
    minorScales.put("G", new String[] {"G", "A", "Bb", "C", "D", "Eb", "F"});
    minorScales.put("A", new String[] {"A", "B", "C", "D", "E", "F", "G"});
    minorScales.put("B", new String[] {"B", "C#", "D", "E", "F#", "G", "A"});
  }

  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();
    String key = request.queryParams("key");
    String style = request.queryParams("style");
    String scale = request.queryParams("scale"); // Major or minor

    if (key == null || style == null || scale == null) {
      response.status(400);
      responseMap.put("error", "Missing 'key', 'style', or 'scale' parameter.");
      return responseMap;
    }

    String[] mode =
        scale.equalsIgnoreCase("minor")
            ? minorScales.get(key.toUpperCase())
            : majorScales.get(key.toUpperCase());
    if (scale == null) {
      response.status(400);
      responseMap.put("error", "Invalid key.");
      return toMoshiJson(responseMap);
    }

    // Mocked chord progression logic
    String[] progression = new String[] {};

    // Chord progression styles
    switch (style.toLowerCase()) {
      case "pop":
        progression = generatePopProgression(mode);
        break;
      case "jazz":
        progression = generateJazzProgression(mode);
        break;
      case "rock":
        progression = generateRockProgression(mode);
        break;
      case "blues":
        progression = generateBluesProgression(mode);
        break;
      default:
        responseMap.put("progression", new String[] {"Unknown Style"});
        return responseMap;
    }

    responseMap.put("progression", progression);
    return toMoshiJson(responseMap);
  }

  private String[] generatePopProgression(String[] scale) {
    // I, V, vi, IV progression (in the given key)
    return new String[] {scale[0], scale[4], scale[5], scale[3]}; // I, V, vi, IV
  }

  private String[] generateJazzProgression(String[] scale) {
    // ii, V, I, VI progression (in the given key)
    return new String[] {scale[1], scale[4], scale[0], scale[5]}; // ii, V, I, VI
  }

  private String[] generateRockProgression(String[] scale) {
    // I, IV, V progression (in the given key)
    return new String[] {scale[0], scale[3], scale[4]}; // I, IV, V
  }

  private String[] generateBluesProgression(String[] scale) {
    // I, IV, I, V, IV, I progression (in the given key)
    return new String[] {
      scale[0], scale[3], scale[0], scale[4], scale[3], scale[0]
    }; // I, IV, I, V, IV, I
  }
}

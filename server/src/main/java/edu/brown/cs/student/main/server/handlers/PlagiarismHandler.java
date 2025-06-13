package edu.brown.cs.student.main.server.handlers;

import io.github.cdimascio.dotenv.Dotenv;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class PlagiarismHandler implements Route {
  String scanID = null;

  @Override
  public Object handle(Request request, Response response) throws Exception {
    Map<String, Object> responseMap = new LinkedHashMap<>();
    Dotenv dotenv = Dotenv.load();

    // Step 1: Retrieve email and API key from environment variables
    String email = dotenv.get("COPYLEAKS_EMAIL");
    String apiKey = dotenv.get("COPYLEAKS_API_KEY");

    if (email == null || apiKey == null) {
      throw new Exception(
          "Environment variables COPYLEAKS_EMAIL or COPYLEAKS_API_KEY are not set.");
    }

    // Step 2: Authenticate to get an access token
    String authUrl = "https://id.copyleaks.com/v3/account/login/api";
    String authPayload = String.format("{\"email\":\"%s\", \"key\":\"%s\"}", email, apiKey);

    HttpRequest authRequest =
        HttpRequest.newBuilder()
            .uri(URI.create(authUrl))
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(authPayload))
            .build();

    HttpClient client = HttpClient.newHttpClient();
    HttpResponse<String> authResponse =
        client.send(authRequest, HttpResponse.BodyHandlers.ofString());

    if (authResponse.statusCode() != 200) {
      throw new Exception("Authentication failed: " + authResponse.body());
    }

    // Extract access token
    String accessToken = authResponse.body().split("\"access_token\":\"")[1].split("\"")[0];
    String expiresDate = authResponse.body().split("\".expires\":\"")[1].split("\"")[0];
    Instant expires = Instant.parse(expiresDate);

    try {
      // Step 3: Submit text for plagiarism checking
      scanID = generateScanId();
      String submitUrl = "https://api.copyleaks.com/v3/scans/submit/file/" + scanID;
      String textToCheck = request.queryParams("text");

      // Base64 encode the text to check
      String base64Text = Base64.getEncoder().encodeToString(textToCheck.getBytes());

      // Prepare the payload for submission
      String submitPayload =
          String.format(
              """
            {
                "base64": "%s",
                "filename": "file.txt",
                "properties": {
                    "sandbox": true,
                    "webhooks": {
                        "status": "https://duck-free-hugely.ngrok-free.app/webhook/{status}"
                    }
                }
            }
            """,
              base64Text);

      HttpRequest submitRequest =
          HttpRequest.newBuilder()
              .uri(URI.create(submitUrl))
              .header("Authorization", "Bearer " + accessToken)
              .header("Content-Type", "application/json")
              .PUT(HttpRequest.BodyPublishers.ofString(submitPayload))
              .build();

      HttpResponse<String> submitResponse =
          client.send(submitRequest, HttpResponse.BodyHandlers.ofString());

      if (submitResponse.statusCode() == 201) {
        responseMap.put("response_type", "success");
        responseMap.put("scanID", scanID);
      }
    } catch (Exception e) {
      responseMap.put("response_type", "failed");
      responseMap.put("error", e);
      responseMap.put("message", e.getMessage());
    }
    return Utils.toMoshiJson(responseMap);
  }

  public static String generateScanId() {
    String ALLOWED_CHARACTERS = "abcdefghijklmnopqrstuvwxyz0123456789!@$&-=_()';:.,~";
    int SCAN_ID_LENGTH = 36;
    SecureRandom random = new SecureRandom();
    StringBuilder scanId = new StringBuilder(SCAN_ID_LENGTH);

    for (int i = 0; i < SCAN_ID_LENGTH; i++) {
      int index = random.nextInt(ALLOWED_CHARACTERS.length());
      scanId.append(ALLOWED_CHARACTERS.charAt(index));
    }

    return scanId.toString();
  }

  public String getScanId() {
    return scanID;
  }
}

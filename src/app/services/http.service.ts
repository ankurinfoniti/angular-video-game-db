import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { forkJoin, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment as env } from "src/environments/environment";
import { APIResponse, Game } from "../models";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(private http: HttpClient) {}

  getGameList(
    ordering: string,
    search?: string
  ): Observable<APIResponse<Game>> {
    let params = new HttpParams().set("ordering", ordering);

    if (search) {
      params = new HttpParams().set("ordering", ordering).set("search", search);
    }

    return this.http.get<APIResponse<Game>>(`${env.BASE_URL}/games`, {
      params: params,
    });
  }

  getGameDetails(id: string): Observable<Game> {
    const gameInfoRequest = this.http.get(`${env.BASE_URL}/games/${id}`);
    const gameTrailersRequest = this.http.get(
      `${env.BASE_URL}/games/${id}/movies`
    );
    const gameScreenshotsRequest = this.http.get(
      `${env.BASE_URL}/games/${id}/screenshots`
    );

    return forkJoin([
      gameInfoRequest,
      gameScreenshotsRequest,
      gameTrailersRequest,
    ]).pipe(
      map((resp: any) => {
        return {
          id: resp[0]["id"],
          background_image: resp[0]["background_image"],
          name: resp[0]["name"],
          released: resp[0]["released"],
          metacritic_url: resp[0]["metacritic_url"],
          website: resp[0]["website"],
          description: resp[0]["description"],
          metacritic: resp[0]["metacritic"],
          genres: resp[0]["genres"],
          parent_platforms: resp[0]["parent_platforms"],
          publishers: resp[0]["publishers"],
          ratings: resp[0]["ratings"],
          screenshots: resp[1]["results"],
          trailers: resp[2]["results"],
        };
      })
    );
  }
}

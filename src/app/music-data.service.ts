import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SpotifyTokenService } from './spotify-token.service';
import { environment } from './../environments/environment';

import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MusicDataService {
  //private favouritesList: Array<any> = [];

  constructor(private spotifyToken: SpotifyTokenService, private http: HttpClient) { }  

  getNewReleases(): Observable<SpotifyApi.ListOfNewReleasesResponse> {
      return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
        return this.http.get<SpotifyApi.ListOfNewReleasesResponse>("https://api.spotify.com/v1/browse/new-releases", { headers: { "Authorization": `Bearer ${token}` } });
      }));
  }

  getArtistById(id: string): Observable<SpotifyApi.SingleArtistResponse> {
    console.log("ADD", id);
    return this.spotifyToken.getBearerToken().pipe(
      mergeMap((token) => {
        return this.http.get<any>(`https://api.spotify.com/v1/artists/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
    );
  }

  getAlbumsByArtistId(id: string): Observable<SpotifyApi.ArtistsAlbumsResponse> {
    const include_groups = 'album,single';
    const limit = 50;
    return this.spotifyToken.getBearerToken().pipe(
      mergeMap((token) => {
        return this.http.get<any>(
          `https://api.spotify.com/v1/artists/${id}/albums?include_groups=${include_groups}&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      })
    );
  }

  getAlbumById(id: string): Observable<SpotifyApi.SingleAlbumResponse> {
    return this.spotifyToken.getBearerToken().pipe(
      mergeMap((token) => {
        return this.http.get<any>(`https://api.spotify.com/v1/albums/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
    );
  }

  searchArtists(searchString: string): Observable<SpotifyApi.ArtistSearchResponse> {
    const q = searchString;
    const type = 'artist';
    const limit = 50;
    return this.spotifyToken.getBearerToken().pipe(
      mergeMap((token) => {
        return this.http.get<any>(
          `https://api.spotify.com/v1/search?q=${q}&type=${type}&limit=${limit}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      })
    );
  }

  addToFavourites(id:string): Observable<[String]> {
    // TODO: make a PUT request to environment.userAPIBase/favourites/:id to add id to favourites
    console.log("ADD", id);
    return this.http.put<any>(`${environment.userAPIBase}/favourites/${id}`, id);
  }

  removeFromFavourites(id:string): Observable<any> {
    return this.http.delete<[String]>(`${environment.userAPIBase}/favourites/${id}`).pipe(mergeMap(favouritesArray => {
      // TODO: Perform the same tasks as the original getFavourites() method, only using "favouritesArray" from above, instead of this.favouritesList
      // NOTE: for the empty array, you will need to use o=>o.next({tracks: []}) instead of o=>{o.next([])}

      if (favouritesArray.length > 0) {
        const index: number = favouritesArray.indexOf(id);

        if (index != -1) {
          favouritesArray.splice(index, 1);
        }

        return this.getFavourites();

      } else {
        return new Observable(o=>o.next({tracks: []}));
      }
    }));
  }

  getFavourites(): Observable<any> {
    return this.http.get<[String]>(`${environment.userAPIBase}/favourites/`).pipe(mergeMap(favouritesArray => {
      // TODO: Perform the same tasks as the original getFavourites() method, only using "favouritesArray" from above, instead of this.favouritesList
      // NOTE: for the empty array, you will need to use o=>o.next({tracks: []}) instead of o=>{o.next([])}

      if (favouritesArray.length > 0) {
        return this.spotifyToken.getBearerToken().pipe(mergeMap(token=>{
          return this.http.get<any>(`https://api.spotify.com/v1/tracks?ids=${favouritesArray.join()}`, { headers: { "Authorization": `Bearer ${token}` } });
        }));
      } else {
        return new Observable(o=>o.next({tracks: []}));
      }
    }));
  }

}

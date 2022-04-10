import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicDataService } from '../music-data.service';


@Component({
  selector: 'app-artist-discography',
  templateUrl: './artist-discography.component.html',
  styleUrls: ['./artist-discography.component.css']
})
export class ArtistDiscographyComponent implements OnInit {
  albums!: any[];
  artist: any;

  constructor(
    private route: ActivatedRoute,
    private dataService: MusicDataService
  ) {
   }

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    this.dataService.getArtistById(id).subscribe((data) => {
      this.artist = data;
    });
    this.dataService.getAlbumsByArtistId(id).subscribe((data) => {
      const seen = new Set();
      let unique = data.items;
      this.albums = unique.filter((album: { name: unknown }) => {
        const duplicate = seen.has(album.name);
        seen.add(album.name);
        return !duplicate;
      });

    });
  }
}


import { Component, OnDestroy, OnInit } from '@angular/core';
import { MusicDataService } from '../music-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css']
})
export class AlbumComponent implements OnInit, OnDestroy {
  album: any;
  sub: any;
  id: any;
  //id: string = "";

  constructor(
    private dataService: MusicDataService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.sub = this.dataService.getAlbumById(this.id).subscribe((data) => {
      console.log('response from API');
      console.log(data);
      this.album = data;
    });
  }


  addToFavourites(trackid: any) {
    this.sub = this.dataService.addToFavourites(trackid).subscribe(
      (apiResponse) => {
        if (apiResponse) {
          this.snackBar.open('Adding to Favourites...', 'Done', {
            duration: 1500,
          });
        }
      },
      (err) => {
        this.snackBar.open('Unable to add song to Favourites', 'Failed', {
          duration: 1500,
        });
      }
    );
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

}

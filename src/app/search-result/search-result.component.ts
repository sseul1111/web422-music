import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {
  results: any;
  searchQuery: any;

  constructor(
    private route: ActivatedRoute,
    private dataService: MusicDataService
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.searchQuery = params.get('q');
    });
    this.dataService.searchArtists(this.searchQuery).subscribe((data) => {
      let arr = data.artists.items;

      this.results = arr.filter((item: any) => item.images.length > 0);
    });
  }
  
}


import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { BookService } from '../../services/book.service';
import { AuthorService } from '../../services/author.service';
import { Book } from '../../models/book';
import { Author } from '../../models/author';
import type { EChartsOption } from 'echarts';
import * as echarts from 'echarts';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  books: Book[] = [];
  authors: Author[] = [];
  
  booksPerYearOption: EChartsOption = {};
  publishStatusOption: EChartsOption = {};
  authorGenreOption: EChartsOption = {};
  recordsSimulationOption: EChartsOption = {};

  private simulationInterval: any;
  recordsData: number[] = [4000];
  private timeData: string[] = [];

  constructor(
    private bookService: BookService,
    private authorService: AuthorService
  ) {}

  ngOnInit() {
    this.initializeCharts();
    this.loadData();
    this.startRecordsSimulation();
  }

  ngOnDestroy() {
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
    }
  }

  private initializeCharts() {
    // Inicializar con un estado de carga para evitar parpadeos blancos en los gráficos
    const loadingOption: EChartsOption = {
      showLoading: true,
      loadingOption: {
        text: 'Cargando datos...',
        effect: 'spin',
        textColor: '#2c3e50',
        maskColor: 'rgba(255, 255, 255, 0.8)'
      }
    };

    this.booksPerYearOption = loadingOption;
    this.publishStatusOption = loadingOption;
    this.authorGenreOption = loadingOption;
    this.recordsSimulationOption = loadingOption;
  }

  private loadData() {
    forkJoin({
      books: this.bookService.getBooks(),
      authors: this.authorService.getAuthors()
    }).subscribe({
      next: ({ books, authors }) => {
        this.books = books;
        this.authors = authors;
        this.updateCharts();
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.showErrorState();
      }
    });
  }

  private showErrorState() {
    const errorOption: EChartsOption = {
      title: {
        text: 'Error al cargar datos',
        subtext: 'Por favor, intente más tarde',
        left: 'center',
        top: 'center',
        textStyle: {
          color: '#e74c3c'
        }
      }
    };

    this.booksPerYearOption = errorOption;
    this.publishStatusOption = errorOption;
    this.authorGenreOption = errorOption;
  }

  private updateCharts() {
    this.updateBooksPerYearChart();
    this.updatePublishStatusChart();
    this.updateAuthorGenreChart();
  }

  private updateBooksPerYearChart() {
    const yearCounts = this.books.reduce((acc, book) => {
      acc[book.anio] = (acc[book.anio] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number });

    const years = Object.keys(yearCounts).sort();
    const counts = years.map(year => yearCounts[parseInt(year)]);

    this.booksPerYearOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [{
        type: 'category',
        data: years,
        axisTick: {
          alignWithLabel: true
        }
      }],
      yAxis: [{
        type: 'value',
        name: 'Cantidad de Libros'
      }],
      series: [{
        name: 'Libros',
        type: 'bar',
        barWidth: '60%',
        data: counts,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' }
          ])
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' }
            ])
          }
        }
      }]
    };
  }

  private updatePublishStatusChart() {
    const published = this.books.filter(book => book.publicado).length;
    const unpublished = this.books.length - published;

    this.publishStatusOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 10,
        data: ['Publicados', 'No Publicados']
      },
      series: [{
        name: 'Estado',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: [
          { value: published, name: 'Publicados', itemStyle: { color: '#27ae60' } },
          { value: unpublished, name: 'No Publicados', itemStyle: { color: '#e74c3c' } }
        ]
      }]
    };
  }

  private updateAuthorGenreChart() {
    const genreCounts = this.authors.reduce((acc, author) => {
      acc[author.genero] = (acc[author.genero] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const data = Object.entries(genreCounts).map(([name, value]) => ({
      name,
      value,
      itemStyle: {
        color: name === 'Masculino' ? '#3498db' : '#e84393'
      }
    }));

    this.authorGenreOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        data: Object.keys(genreCounts)
      },
      series: [{
        name: 'Género',
        type: 'pie',
        radius: ['50%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '20',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: true
        },
        data: data
      }]
    };
  }

  private startRecordsSimulation() {
    const now = new Date();
    this.timeData = [this.formatTime(now)];

    this.simulationInterval = setInterval(() => {
      const newValue = Math.floor(Math.random() * (12000 - 4000 + 1)) + 4000;
      const newTime = new Date();
      
      this.recordsData.push(newValue);
      this.timeData.push(this.formatTime(newTime));

      // Mantener solo los últimos 20 registros de tiempo y datos
      if (this.recordsData.length > 20) {
        this.recordsData.shift();
        this.timeData.shift();
      }

      this.updateRecordsChart();
    }, 5000);

    this.updateRecordsChart();
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString();
  }

  private updateRecordsChart() {
    this.recordsSimulationOption = {
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const time = params[0].axisValue;
          const value = params[0].data;
          return `${time}<br/>Registros: ${value}`;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.timeData,
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        type: 'value',
        name: 'Registros',
        min: 3000,
        max: 13000
      },
      series: [{
        name: 'Registros',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(58, 123, 213, 0.5)' },
            { offset: 1, color: 'rgba(58, 123, 213, 0.1)' }
          ])
        },
        itemStyle: {
          color: '#3a7bd5'
        },
        data: this.recordsData
      }]
    };
  }
}


import VChart, { IDataType, ILineChartSpec, ITheme, LineChart } from "@visactor/vchart";




const margin = {
  top: 50,
  right: 30,
  bottom: 50,
  left: 50,
};



export interface XYChartConfig {
  title: string;
  xLabel: string;
  yLabel: string;
  data: IDataType;
  showDots: boolean;
  transparent: boolean;
  theme?: "light" | "dark";
  mode?: string,
  modeParams?: any,
}




/**
 * 生成 VChart 折线图 spec
 * X轴格式化: "MMM DD, YYYY"
 * 字体: "xkcd"
 * 线条颜色: "black"
 */
export const generateDefaultVChartLineSpec = (
  isDark: boolean = false,
  transparent: boolean = false
): ILineChartSpec => {
  const spec: ILineChartSpec = {
    type: "line",
    animation: false,
    width: 800,
    height: 533,
    data: {
      values: [],
    },
    xField: "x",
    yField: "y",
    seriesField: "series",
    legends: {
      "visible": true
    },
    // X轴配置 - 格式化日期为 "MMM DD, YYYY"
    axes: [
      {
        orient: "bottom",
        type: "time",
        layers: [
          {
            timeFormat: `%Y-%m-%d`
          }
        ],
        label: {
          style: {
            fontFamily: "xkcd",
          },

        },
        title: {
          text: "",
          visible: false,
        },
      },
      {
        orient: "left",
        type: "linear",
        label: {
          style: {
            fontFamily: "xkcd",
          },
        },
        title: {
          text: "",
          visible: false,
        },
      },
    ],
    
    line: {
      style: {

        lineWidth: 2,
      },
    },
    tooltip: {
      dimension: {
        title: {
          valueTimeFormat: '%Y-%m-%d'
        }
     
      }
    },
  
    crosshair: {
      xField: {
        visible: true,
        line: {
          type: 'line', // Defaults is `rect`
          style: {
            lineWidth: 1,
            opacity: 1,
        
            lineDash: [2, 2]
          }
        },
     
        label: {
          visible: true, // label is off by default
          formatter: '{label:%Y-%m-%d}',
        }
      },
      yField: {
        visible: true,
   
       
        line: {
          style: {
            lineWidth: 1,
            opacity: 1,
  
            lineDash: [2, 2]
          }
        },
        label: {
          visible: true // label is off by default
        }
      }
    }

  };
  if (transparent) {
    spec.background = "transparent";
  }
  if (isDark ) {
    spec.theme = customDarkTheme as ITheme;
  } else {
    spec.theme = customLightTheme as ITheme;
  }
  return spec;
};



let  customLightTheme:ITheme|null=null;
let  customDarkTheme:ITheme|null=null;

const XYChart = (
  container: HTMLDivElement,
  { title, xLabel, yLabel, data, showDots, theme, transparent, mode, modeParams }: XYChartConfig
): VChart => {
  if(customLightTheme === null || customDarkTheme === null) {
    customLightTheme =VChart.ThemeManager.getTheme("light")
    customLightTheme.fontFamily = "xkcd";
    customDarkTheme =VChart.ThemeManager.getTheme("dark")
    customDarkTheme.fontFamily = "xkcd";
 
  }

  const options: ILineChartSpec = {
    ...generateDefaultVChartLineSpec(theme === "dark", transparent),
  };

  options.data = data;
  if (title) {
    options.title = {
      text: title,
      align:"center",
      textStyle: {
        fontSize: 24
      },
    };
  }
  if (xLabel) {
    if (options.axes?.[0]) {
      options.axes[0].title = {
        text: xLabel,
        visible: true,
      };
    }
  }
  if (yLabel) {
    if (options.axes?.[1]) {
      options.axes[1].title = {
        text: yLabel,
        visible: true,
      };
    }
  }
  if(mode==="node") {
    return new VChart(options, { mode, modeParams ,dpr:2});

  }

  return new VChart(options, { dom: container ,dpr:window.devicePixelRatio});
};

export default XYChart;




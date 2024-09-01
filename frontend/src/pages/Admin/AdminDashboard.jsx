import Chart from "react-apexcharts";
import { useGetUsersQuery } from "../../redux/api/usersApiSlice";
import {
  useGetTotalOrdersQuery,
  useGetTotalSalesByDateQuery,
  useGetTotalSalesQuery,
} from "../../redux/api/orderApiSlice";
import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import OrderList from "./OrderList";
import Loader from "../../components/Loader";

const AdminDashboard = () => {
  const { data: sales, isLoading } = useGetTotalSalesQuery();
  const { data: customers, isLoading: loading } = useGetUsersQuery();
  const { data: orders, isLoading: loadingTwo } = useGetTotalOrdersQuery();
  const { data: salesDetail } = useGetTotalSalesByDateQuery();

  const [state, setState] = useState({
    options: {
      chart: {
        type: "line",
        background: "#1E1E1E",
      },
      tooltip: {
        theme: "dark",
      },
      colors: ["#00E396"],
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        text: "Sales Trend",
        align: "left",
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
        },
      },
      grid: {
        borderColor: "#444",
      },
      markers: {
        size: 4,
      },
      xaxis: {
        categories: [],
        title: {
          text: "Date",
        },
        labels: {
          style: {
            colors: "#ccc",
          },
        },
      },
      yaxis: {
        title: {
          text: "Sales",
        },
        labels: {
          style: {
            colors: "#ccc",
          },
        },
        min: 0,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -10,
        offsetX: 0,
        labels: {
          colors: "#fff",
        },
      },
    },
    series: [{ name: "Sales", data: [] }],
  });

  useEffect(() => {
    if (salesDetail) {
      const formattedSalesDate = salesDetail.map((item) => ({
        x: item._id,
        y: item.totalSales,
      }));

      setState((prevState) => ({
        ...prevState,
        options: {
          ...prevState.options,
          xaxis: {
            categories: formattedSalesDate.map((item) => item.x),
          },
        },
        series: [
          { name: "Sales", data: formattedSalesDate.map((item) => item.y) },
        ],
      }));
    }
  }, [salesDetail]);

  return (
    <>
      <AdminMenu />

      <section className="xl:ml-16 md:ml-0 p-6 bg-gray-900 min-h-screen">
        <div className="flex flex-wrap justify-between gap-6 mb-8">
          {[
            { label: 'Sales', value: sales?.totalSales.toFixed(2), color: 'bg-teal-500' },
            { label: 'Customers', value: customers?.length, color: 'bg-blue-500' },
            { label: 'All Orders', value: orders?.totalOrders, color: 'bg-purple-500' },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center bg-gray-800 text-white rounded-lg shadow-lg p-6 w-full sm:w-64"
            >
              <div className={`text-3xl font-bold rounded-full ${item.color} text-center w-12 h-12 flex items-center justify-center mb-4`}>
                $
              </div>
              <p className="text-sm mb-2">{item.label}</p>
              <h1 className="text-2xl font-bold">
                {isLoading ? <Loader /> : item.value}
              </h1>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <Chart
            options={state.options}
            series={state.series}
            type="line"
            width="100%"
            height="400"
          />
        </div>

        <OrderList />
      </section>
    </>
  );
};

export default AdminDashboard;

import { Component } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

export function Dashboard() {
  /*constructor(props) {
    super(props);
    this.state = {
      foods: [],
      editingFood: {},
      modalOpen: false,
      editModalOpen: false,
    }
  }*/

  async function componentDidMount() {
    const response = await api.get('/foods');

    this.setState({ foods: response.data });
  }

  async function handleAddFood(food) {
    const { foods } = this.state;

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      this.setState({ foods: [...foods, response.data] });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food) {
    const { foods, editingFood } = this.state;

    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, { ...editingFood, ...food });

      const foodsUpdated = foods.map((f) => (f.id !== foodUpdated.data.id ? f : foodUpdated.data));

      this.setState({ foods: foodsUpdated });
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id) {
    const { foods } = this.state;

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    this.setState({ foods: foodsFiltered });
  }

  function toggleModal() {
    const { modalOpen } = this.state;

    this.setState({ modalOpen: !modalOpen });
  }

  function toggleEditModal() {
    const { editModalOpen } = this.state;

    this.setState({ editModalOpen: !editModalOpen });
  }

  function handleEditFood(food) {
    this.setState({ editingFood: food, editModalOpen: true });
  }

  const { modalOpen, editModalOpen, editingFood, foods } = this.state;

  return (
    <>
      <Header openModal={this.toggleModal} />
      <ModalAddFood isOpen={modalOpen} setIsOpen={toggleModal} handleAddFood={handleAddFood} />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food key={food.id} food={food} handleDelete={handleDeleteFood} handleEditFood={handleEditFood} />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;

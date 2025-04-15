import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import tw from 'twrnc'
import AsyncStorage from '@react-native-async-storage/async-storage'

const index = () => {
  const [task, setTask] = useState('');
  const [list, setList] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    loadTask();
  }, []);

  useEffect(() => {
    saveTask();
  }, [list]);

  const addTask = () => {
    if (task.trim() === '') return;

    const newTask = {
      id: Date.now().toString(),
      title: task.trim(),
      selected: false, // menambahkan field untuk track kotak kecil terpilih
    };
    setList([...list, newTask]);
    setTask('');
  };

  const loadTask = async () => {
    try {
      const saved = await AsyncStorage.getItem('task');
      if (saved !== null) {
        setList(JSON.parse(saved));
        console.log('berhasil load data');
      }
    } catch (error) {
      console.log('gagal load:', error);
    }
  }

  const saveTask = async () => {
    try {
      await AsyncStorage.setItem('task', JSON.stringify(list));
      console.log('berhasil simpan data');
    } catch (error) {
      console.log('gagal simpan:', error);
    }
  };

  const deleteTask = (id: string) => {
    const filtered = list.filter(item => item.id !== id);
    setList(filtered);
  };

 const hadleEdit = () => {
  const updated = list.map(item =>item.id === editId ? {...item, title: task.trim()} : item);

  setList(updated);
  setTask('');
  setIsEditing(false);
  setEditId(null);

  }
 
const startEdit = (item: any) => {
  setTask(item.title);
  setIsEditing(true);
  setEditId(item.id);
}

  const toggleSelectTask = (id: string) => {
    const updatedList = list.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setList(updatedList);
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <View style={tw`bg-yellow-300 rounded-b-full h-55`} />
      <View style={tw`flex-row gap-3 -mt-15 px-5`}>
        <TextInput
          placeholder='Tambahkan tugas...'
          value={task}
          onChangeText={setTask}
          style={tw`flex-1 border border-gray-600 rounded px-3 py-2`}
        />
        <TouchableOpacity onPress={isEditing ? hadleEdit : addTask} style={tw`bg-yellow-500 rounded justify-center items-center px-4`}>
          <Text style={tw`text-white font-bold`}>Tambah</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={list}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={tw`flex-row px-5 mt-6`}>
           
            <View style={tw`flex-1 border border-gray-300 rounded px-3 py-2 flex-row`}>

            <TouchableOpacity
              onPress={() => toggleSelectTask(item.id)} 
              style={[
                tw`w-6 h-6 mr-3 rounded`, 
                {
                  backgroundColor: item.selected ? '#4CAF50' : '#FFFFFF', 
                  borderWidth: 1,
                  borderColor: '#000', // Batas kotak kecil
                }
              ]}
            />
            
            <Text>{item.title}</Text>

           </View>
           
            <TouchableOpacity
              onPress={() => deleteTask(item.id)}
              style={tw`bg-red-500 rounded justify-center items-center px-4 ml-3 rounded-full h-10`}
            >
              <Text style={tw`text-white font-bold`}>-</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => startEdit(item)}
              style={tw`bg-red-500 rounded justify-center items-center px-4 ml-3 rounded-full h-10`}
            >
              <Text style={tw`text-white font-bold`}>?</Text>
            </TouchableOpacity>

          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default index;

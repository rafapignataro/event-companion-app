import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Form, Input, notification, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useLocation } from '../../../../contexts/location';
import { locationCategories } from '../../../../data/locationCategories';
import { updateLocation } from '../../../../services/locations/updateLocation';

type FormFields = {
	name: string,
	description?: string,
	locationCategoryCode: string
}

export const LocationMenu = () => {
	const [locationFormOpen, setLocationFormOpen] = useState(false);
	const [locationForm] = Form.useForm();

	const { selectedLocation, selectLocation, refreshLocations  } = useLocation();

	useEffect(() => {
		if (!selectedLocation) return setLocationFormOpen(false);
		return locationForm.setFieldsValue(selectedLocation);
	}, [selectedLocation]);

	const openNotification = (type: string, message: string, err?: string) => {
		if(type == 'success' || type == 'error')
			notification[type]({ message: message, description: err});
		return;
	};

	const onFinish = async (values: FormFields) => {
		if (!selectedLocation) return;
		const { id } = selectedLocation;
		const requestData = {
			...selectedLocation,
			...values
		};
		try {
			if (!requestData.eventId) return;
			
			await updateLocation({ id, locationData: requestData });
			await refreshLocations();

			selectLocation(null);
			openNotification('success', 'Dados enviados com sucesso');
			setLocationFormOpen(false);
		} catch (e) {
			openNotification('error', 'Houve um erro ao enviar os dados');
			setLocationFormOpen(false);
		}
	};

	return (
		<>
			{locationFormOpen ? (
				<>
					<Form
						form={locationForm}
						name="locationForm"
						onFinish={onFinish}
						autoComplete="off"
						labelCol={{ span: 24 }}
						initialValues={{
							...selectedLocation,
							locationCategoryCode: selectedLocation?.locationCategory.code
						}}
					>
						<Form.Item
							label="NOME"
							name="name"
							rules={[{ required: true, message: 'INSIRA UM NOME PARA O LOCAL' }]}
						>
							<Input placeholder=' - ' size='large'/>
						</Form.Item>

						<Form.Item
							label="DESCRIÇÃO"
							name="description"
						>
							<Input.TextArea 
								placeholder=' - '
								showCount maxLength={255}
								style={{ height: 120 }}
								autoSize={{ minRows: 3, maxRows: 5 }}
								size='large'
							/>
						</Form.Item>

						<Form.Item 
							label="CATEGORIA"
							name="locationCategoryCode"
							rules={[{ required: true, message: 'ESCOLHA UMA CATEGORIA PARA O LOCAL' }]}
						>
							<Select
								placeholder=" - "
								size='large'
							>
								{ locationCategories.map((category) => <Select.Option key={category.code} value={category.code}>{category.name}</Select.Option>) }
							</Select>
						</Form.Item>

						<Form.Item>
							<Button size='large' type="primary" icon={<CheckOutlined />} htmlType="submit">
								Salvar
							</Button>
						</Form.Item>

						<Form.Item>
							<Button size='large' type="default" icon={<CloseOutlined />} onClick={() => {
								selectLocation(null);
								setLocationFormOpen(false);
							}}>
								Cancelar
							</Button>
						</Form.Item>
					</Form>
				</>
			) : (
				<>
					<Button 
						disabled={!selectedLocation}
						onClick={() => setLocationFormOpen(true)}
						size='large'
					>Editar um local</Button>

					{!selectedLocation && (
						<Typography.Title 
							level={4} 
							style={{ textAlign: 'center', margin: '1em 0' }}
						>
							SELECIONE UM LOCAL
						</Typography.Title>
					)}
				</>
			)}
		</>
	);
};

